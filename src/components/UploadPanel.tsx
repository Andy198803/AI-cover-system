import type { CoverRow } from "../types/cover";

type UploadPanelProps = {
  rows: CoverRow[];
  selectedIndex: number;
  fileName: string;
  error: string;
  onFileChange: (file: File) => void;
  onSelectRow: (index: number) => void;
  onUpdateRow: (row: CoverRow) => void;
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  color: "#5c5c5c",
  marginBottom: "6px",
} as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0cbc3",
  borderRadius: "6px",
  padding: "9px 10px",
  fontSize: "14px",
  color: "#1f1f1f",
  background: "#fff",
  outline: "none",
} as const;

export function UploadPanel({
  rows,
  selectedIndex,
  fileName,
  error,
  onFileChange,
  onSelectRow,
  onUpdateRow,
}: UploadPanelProps) {
  const selectedRow = rows[selectedIndex];

  return (
    <section>
      <div style={{ marginBottom: "18px" }}>
        <label htmlFor="cover-data-file" style={labelStyle}>
          上传数据文档
        </label>
        <input
          id="cover-data-file"
          type="file"
          accept=".xlsx,.csv,.tsv"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onFileChange(file);
            }
          }}
          style={{
            ...inputStyle,
            padding: "8px",
          }}
        />
        <div style={{ marginTop: "8px", fontSize: "12px", color: error ? "#a01818" : "#777" }}>
          {error || (fileName ? `当前文件：${fileName}` : "支持 .xlsx / .csv / .tsv，表头可用 标题、简介。")}
        </div>
      </div>

      {selectedRow && (
        <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
          <div>
            <label htmlFor="cover-title" style={labelStyle}>
              标题
            </label>
            <input
              id="cover-title"
              value={selectedRow.title}
              onChange={(event) => onUpdateRow({ ...selectedRow, title: event.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="cover-description" style={labelStyle}>
              简介
            </label>
            <input
              id="cover-description"
              value={selectedRow.description}
              onChange={(event) =>
                onUpdateRow({ ...selectedRow, description: event.target.value })
              }
              style={inputStyle}
            />
          </div>
        </div>
      )}

      <div>
        <div style={{ ...labelStyle, marginBottom: "8px" }}>数据列表（{rows.length} 条）</div>
        <div
          style={{
            border: "1px solid #ded8cf",
            borderRadius: "8px",
            overflow: "hidden",
            maxHeight: "240px",
            overflowY: "auto",
            background: "#fff",
          }}
        >
          {rows.map((row, index) => (
            <button
              key={row.id}
              type="button"
              onClick={() => onSelectRow(index)}
              style={{
                width: "100%",
                display: "block",
                border: 0,
                borderBottom: index === rows.length - 1 ? 0 : "1px solid #eee7dd",
                padding: "10px 12px",
                textAlign: "left",
                background: index === selectedIndex ? "#f2eadf" : "#fff",
                color: "#222",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>
                {row.title || "未填写标题"}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.description || "未填写简介"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
