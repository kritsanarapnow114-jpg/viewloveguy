export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap", marginBottom: 26 }}>
      <div>
        <h1 className="mali" style={{ fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: "-.01em" }}>
          {title}
        </h1>
        <p style={{ margin: "5px 0 0", color: "#9b8fb0", fontSize: 13.5 }}>{subtitle}</p>
      </div>
      {children && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{children}</div>}
    </div>
  );
}

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b8a9d0", fontSize: 13 }}>⌕</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหา…"
        style={{
          padding: "10px 12px 10px 30px",
          border: "1px solid #e0d3f0",
          borderRadius: 11,
          fontSize: 13.5,
          background: "#fff",
          outline: "none",
          width: 200,
        }}
      />
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        background: "#7c5cc4",
        color: "#fff",
        border: "none",
        borderRadius: 11,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      + {label}
    </button>
  );
}

export function ExportButtons({ onExportPdf, onExportXls }: { onExportPdf: () => void; onExportXls: () => void }) {
  const btnStyle: React.CSSProperties = {
    padding: "10px 14px",
    background: "#fff",
    color: "#7c5cc4",
    border: "1px solid #e0d3f0",
    borderRadius: 11,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
  return (
    <>
      <button onClick={onExportPdf} style={btnStyle}>
        ↧ PDF
      </button>
      <button onClick={onExportXls} style={btnStyle}>
        ↧ Excel
      </button>
    </>
  );
}
