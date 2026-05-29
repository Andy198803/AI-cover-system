import { useRef, useState } from "react";
import { CoverCanvas } from "./components/CoverRenderer";
import { ExportPanel } from "./components/ExportPanel";
import { TemplateFonts } from "./components/TemplateFonts";
import { UploadPanel } from "./components/UploadPanel";
import { activeCoverTemplate } from "./config/coverConfig";
import { demoData } from "./data/demoData";
import type { CoverRow } from "./types/cover";
import { exportCoverPng, exportCoverZip, getCoverFileName } from "./utils/exportImages";
import { parseCoverDataFile } from "./utils/parseExcel";

const initialRows: CoverRow[] = [{ id: "demo-1", ...demoData }];

function App() {
  const [rows, setRows] = useState<CoverRow[]>(initialRows);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const exportRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const selectedRow = rows[selectedIndex] ?? rows[0];

  async function handleFileChange(file: File) {
    try {
      const parsedRows = await parseCoverDataFile(file);

      if (parsedRows.length === 0) {
        setError("没有读取到有效数据，请检查表头或前两列内容。");
        return;
      }

      setRows(parsedRows);
      setSelectedIndex(0);
      setFileName(file.name);
      setError("");
    } catch (error) {
      console.error("文件解析失败真实原因：", error);
      setError("文件解析失败，请打开浏览器控制台查看真实错误。");
    }
  }

  function handleUpdateRow(nextRow: CoverRow) {
    setRows((currentRows) =>
      currentRows.map((row, index) => (index === selectedIndex ? nextRow : row))
    );
  }

  async function handleExportCurrent() {
    const row = selectedRow;
    const node = row ? exportRefs.current[row.id] : null;

    if (!row || !node) {
      return;
    }

    setIsExporting(true);

    try {
      await exportCoverPng({
        node,
        fileName: getCoverFileName({ ...row, index: selectedIndex }),
      });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportAll() {
    const items = rows
      .map((row, index) => {
        const node = exportRefs.current[row.id];

        if (!node) {
          return null;
        }

        return {
          node,
          fileName: getCoverFileName({ ...row, index }),
        };
      })
      .filter((item): item is { node: HTMLDivElement; fileName: string } => item !== null);

    setIsExporting(true);

    try {
      await exportCoverZip(items);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <TemplateFonts />
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "360px minmax(0, 1fr)",
          background: activeCoverTemplate.canvas.backgroundColor,
          color: "#222",
        }}
      >
        <aside
          style={{
            background: "#f7f1e8",
            borderRight: "1px solid #2a2724",
            padding: "22px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              lineHeight: 1.3,
              margin: "0 0 16px",
              color: "#211b16",
              fontWeight: 800,
            }}
          >
            封面批量生成
          </h1>
          <UploadPanel
            rows={rows}
            selectedIndex={selectedIndex}
            fileName={fileName}
            error={error}
            onFileChange={handleFileChange}
            onSelectRow={setSelectedIndex}
            onUpdateRow={handleUpdateRow}
          />
          <ExportPanel
            total={rows.length}
            isExporting={isExporting}
            onExportCurrent={handleExportCurrent}
            onExportAll={handleExportAll}
          />
        </aside>

        <section
          style={{
            minWidth: 0,
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          {selectedRow && <CoverCanvas template={activeCoverTemplate} data={selectedRow} />}
        </section>
      </main>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: `${activeCoverTemplate.canvas.previewWidth}px`,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        {rows.map((row) => (
          <CoverCanvas
            key={row.id}
            ref={(node) => {
              exportRefs.current[row.id] = node;
            }}
            template={activeCoverTemplate}
            data={row}
          />
        ))}
      </div>
    </>
  );
}

export default App;
