import { toPng } from "html-to-image";
import JSZip from "jszip";

export type ExportItem = {
  node: HTMLElement;
  fileName: string;
};

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "cover"
  );
}

export function getCoverFileName(params: { title: string; index: number }) {
  const number = String(params.index + 1).padStart(2, "0");
  const name = sanitizeFileName(`${number}-${params.title}`);
  return `${name}.png`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function waitForAssets() {
  if (document.fonts) {
    await document.fonts.ready;
  }
}

export async function exportCoverPng(item: ExportItem) {
  await waitForAssets();

  const dataUrl = await toPng(item.node, {
    cacheBust: true,
    pixelRatio: 1,
  });
  const blob = await dataUrlToBlob(dataUrl);

  downloadBlob(blob, item.fileName);
}

export async function exportCoverZip(items: ExportItem[], zipFileName = "covers.zip") {
  await waitForAssets();

  const zip = new JSZip();

  for (const item of items) {
    const dataUrl = await toPng(item.node, {
      cacheBust: true,
      pixelRatio: 1,
    });
    const blob = await dataUrlToBlob(dataUrl);
    zip.file(item.fileName, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, zipFileName);
}
