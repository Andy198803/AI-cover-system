type ExportPanelProps = {
  total: number;
  isExporting: boolean;
  onExportCurrent: () => void;
  onExportAll: () => void;
};

const buttonStyle = {
  border: 0,
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
} as const;

export function ExportPanel({
  total,
  isExporting,
  onExportCurrent,
  onExportAll,
}: ExportPanelProps) {
  return (
    <section
      style={{
        borderTop: "1px solid #ded8cf",
        marginTop: "18px",
        paddingTop: "18px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <button
          type="button"
          disabled={isExporting || total === 0}
          onClick={onExportCurrent}
          style={{
            ...buttonStyle,
            background: isExporting || total === 0 ? "#c8c2ba" : "#372d24",
            color: "#fff",
          }}
        >
          导出当前 PNG
        </button>
        <button
          type="button"
          disabled={isExporting || total === 0}
          onClick={onExportAll}
          style={{
            ...buttonStyle,
            background: isExporting || total === 0 ? "#c8c2ba" : "#7a1f1f",
            color: "#fff",
          }}
        >
          批量下载 ZIP
        </button>
      </div>
      <div style={{ marginTop: "8px", fontSize: "12px", color: "#777" }}>
        {isExporting ? "正在生成图片，请稍等。" : `将按当前模板生成 ${total} 张封面。`}
      </div>
    </section>
  );
}
