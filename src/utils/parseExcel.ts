import readXlsxFile from "read-excel-file";
import type { CoverRow } from "../types/cover";

const knownHeaders = {
  title: ["title", "headline", "标题", "封面标题"],
  description: ["description", "desc", "intro", "summary", "简介", "介绍", "描述"],
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function findHeaderKey(value: unknown): keyof typeof knownHeaders | null {
  const normalized = normalizeHeader(value);
  const matchedEntry = Object.entries(knownHeaders).find(([, headers]) =>
    headers.includes(normalized)
  );

  return matchedEntry ? (matchedEntry[0] as keyof typeof knownHeaders) : null;
}

function getCellText(value: unknown) {
  return String(value ?? "").trim();
}

function buildRowsFromMatrix(matrix: unknown[][]): CoverRow[] {
  const headerRowIndex = matrix.findIndex((row) => {
    const matches = row.map(findHeaderKey).filter(Boolean);
    return new Set(matches).size >= 2;
  });
  const hasHeader = headerRowIndex >= 0;
  const headers = hasHeader ? matrix[headerRowIndex] : [];
  const startIndex = hasHeader ? headerRowIndex + 1 : 0;
  const columnMap = hasHeader
    ? headers.reduce<Partial<Record<keyof typeof knownHeaders, number>>>((map, header, index) => {
        const key = findHeaderKey(header);

        if (key && map[key] === undefined) {
          map[key] = index;
        }

        return map;
      }, {})
    : {
        title: 0,
        description: 1,
      };

  return matrix
    .slice(startIndex)
    .map((row, index) => ({
      id: `row-${index + 1}`,
      title: getCellText(row[columnMap.title ?? 0]),
      description: getCellText(row[columnMap.description ?? 1]),
    }))
    .filter((row) => row.title || row.description);
}

function parseDelimitedText(text: string, delimiter: "," | "\t") {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let isQuoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && isQuoted && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      isQuoted = !isQuoted;
      continue;
    }

    if (char === delimiter && !isQuoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !isQuoted) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows.filter((cells) => cells.some((value) => value.trim()));
}

export async function parseCoverDataFile(file: File): Promise<CoverRow[]> {
  const isCsv = /\.csv$/i.test(file.name);
  const isTsv = /\.tsv$/i.test(file.name);
  const matrix = isCsv || isTsv
    ? parseDelimitedText(await file.text(), isTsv ? "\t" : ",")
    : await readXlsxFile(file);

  return buildRowsFromMatrix(matrix as unknown[][]);
}
