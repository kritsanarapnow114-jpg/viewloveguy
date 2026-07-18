"use client";

export function StatusFilter<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | "all";
  onChange: (v: T | "all") => void;
  options: { key: T; label: string }[];
}) {
  const all: { key: T | "all"; label: string }[] = [{ key: "all", label: "ทั้งหมด" }, ...options];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
      {all.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            style={{
              padding: "8px 16px",
              border: `1px solid ${active ? "#7c5cc4" : "#e0d3f0"}`,
              background: active ? "#7c5cc4" : "#fff",
              color: active ? "#fff" : "#7a6e90",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
