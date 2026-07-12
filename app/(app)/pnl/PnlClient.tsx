"use client";

import { useMemo, useState } from "react";
import { fmtBaht } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { PageMascots } from "@/components/PageMascots";

type TxView = { date: string; category: string; amount: number };
type Period = "all" | "year" | "month";

function byCategory(list: TxView[]) {
  const m: Record<string, number> = {};
  list.forEach((r) => {
    m[r.category] = (m[r.category] || 0) + r.amount;
  });
  const max = Math.max(1, ...Object.values(m), 0);
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([name, v]) => ({ name, valueText: fmtBaht(v), pct: Math.max(3, (v / max) * 100) + "%" }));
}

export function PnlClient({ income, expense, canEdit }: { income: TxView[]; expense: TxView[]; canEdit: boolean }) {
  const [period, setPeriod] = useState<Period>("all");
  const now = useMemo(() => new Date(), []);

  const inRange = (iso: string) => {
    if (period === "all") return true;
    const d = new Date(iso);
    if (period === "month") return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    if (period === "year") return d.getFullYear() === now.getFullYear();
    return true;
  };

  const inc = income.filter((r) => inRange(r.date));
  const exp = expense.filter((r) => inRange(r.date));
  const incSum = inc.reduce((a, b) => a + b.amount, 0);
  const expSum = exp.reduce((a, b) => a + b.amount, 0);
  const net = incSum - expSum;
  const margin = incSum > 0 ? Math.round((net / incSum) * 100) + "%" : "—";
  const incomeCats = byCategory(inc);
  const expenseCats = byCategory(exp);

  const periods: { key: Period; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "year", label: "ปีนี้" },
    { key: "month", label: "เดือนนี้" },
  ];

  return (
    <div>
      <PageHeader title="กำไร - ขาดทุน" subtitle="สรุปรายรับ รายจ่าย และกำไรสุทธิ">
        {canEdit && <ExportControls />}
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>รายรับรวม</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6, color: "#4fa98a" }}>
            {fmtBaht(incSum)}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>รายจ่ายรวม</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {fmtBaht(expSum)}
          </div>
        </div>
        <div style={{ background: net >= 0 ? "#4fa98a" : "#d0658a", color: "#fff", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, opacity: 0.8 }}>{net >= 0 ? "กำไรสุทธิ" : "ขาดทุนสุทธิ"}</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6 }}>
            {(net >= 0 ? "+" : "−") + fmtBaht(Math.abs(net)).slice(1)}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>อัตรากำไร</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6 }}>
            {margin}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        {periods.map((p) => {
          const active = period === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${active ? "#7c5cc4" : "#e0d3f0"}`,
                background: active ? "#7c5cc4" : "#fff",
                color: active ? "#fff" : "#7a6e90",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="dash-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "22px 24px" }}>
          <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
            รายรับแยกตามหมวดหมู่
          </div>
          {incomeCats.map((c) => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>{c.name}</span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {c.valueText}
                </span>
              </div>
              <div style={{ height: 8, background: "#f4eefb", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: c.pct, background: "#5fb89a", borderRadius: 6 }} />
              </div>
            </div>
          ))}
          {incomeCats.length === 0 && <div style={{ fontSize: 13, color: "#b8a9d0" }}>ไม่มีรายรับในช่วงนี้เหมียว</div>}
        </div>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "22px 24px" }}>
          <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
            รายจ่ายแยกตามหมวดหมู่
          </div>
          {expenseCats.map((c) => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>{c.name}</span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {c.valueText}
                </span>
              </div>
              <div style={{ height: 8, background: "#f4eefb", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: c.pct, background: "#e39ab6", borderRadius: 6 }} />
              </div>
            </div>
          ))}
          {expenseCats.length === 0 && <div style={{ fontSize: 13, color: "#b8a9d0" }}>ไม่มีรายจ่ายในช่วงนี้เหมียว</div>}
        </div>
      </div>

      <PageMascots accessory="heroRed" pose="stand" />
    </div>
  );
}
