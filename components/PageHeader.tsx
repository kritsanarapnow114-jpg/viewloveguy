import { IconSearch, IconPlus, IconDownload } from "./icons/Icons";

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
        <p style={{ margin: "5px 0 0", color: "#8B7CA6", fontSize: 13.5 }}>{subtitle}</p>
      </div>
      {children && <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#A996C4", display: "flex" }}>
        <IconSearch size={14} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหา…"
        style={{
          padding: "10px 12px 10px 32px",
          border: "1px solid #DCC4FA",
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
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 16px",
        background: "#8B5CF6",
        color: "#fff",
        border: "none",
        borderRadius: 11,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <IconPlus size={14} />
      {label}
    </button>
  );
}

export function ExportButtons({ onExportPdf, onExportXls }: { onExportPdf: () => void; onExportXls: () => void }) {
  const btnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 14px",
    background: "#fff",
    color: "#8B5CF6",
    border: "1px solid #DCC4FA",
    borderRadius: 11,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
  return (
    <>
      <button onClick={onExportPdf} style={btnStyle}>
        <IconDownload size={14} />
        PDF
      </button>
      <button onClick={onExportXls} style={btnStyle}>
        <IconDownload size={14} />
        Excel
      </button>
    </>
  );
}
