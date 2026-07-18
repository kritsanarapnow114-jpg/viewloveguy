"use client";

import type { DateRangeMode, DateRangeValue } from "@/lib/dateRange";

const MODES: { key: DateRangeMode; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "today", label: "วันนี้" },
  { key: "custom", label: "กำหนดเอง" },
];

export function DateRangeFilter({ value, onChange }: { value: DateRangeValue; onChange: (v: DateRangeValue) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {MODES.map((m) => {
          const active = value.mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onChange({ ...value, mode: m.key })}
              style={{
                padding: "8px 14px",
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
              {m.label}
            </button>
          );
        })}
      </div>
      {value.mode === "custom" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            style={{ border: "1px solid #e0d3f0", borderRadius: 9, padding: "7px 8px", fontSize: 12.5, background: "#fff", outline: "none" }}
          />
          <span style={{ color: "#9b8fb0", fontSize: 12.5 }}>ถึง</span>
          <input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            style={{ border: "1px solid #e0d3f0", borderRadius: 9, padding: "7px 8px", fontSize: 12.5, background: "#fff", outline: "none" }}
          />
        </div>
      )}
    </div>
  );
}
