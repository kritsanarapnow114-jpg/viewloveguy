"use client";

import { useState } from "react";
import { fmtBaht } from "@/lib/format";
import { defaultDateRange, inDateRange } from "@/lib/dateRange";
import { PageHeader } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { DateRangeFilter } from "@/components/DateRangeFilter";

type TxView = { date: string; category: string; amount: number };

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
  const [range, setRange] = useState(defaultDateRange);

  const inc = income.filter((r) => inDateRange(r.date, range));
  const exp = expense.filter((r) => inDateRange(r.date, range));
  const incSum = inc.reduce((a, b) => a + b.amount, 0);
  const expSum = exp.reduce((a, b) => a + b.amount, 0);
  const net = incSum - expSum;
  const margin = incSum > 0 ? Math.round((net / incSum) * 100) + "%" : "—";
  const incomeCats = byCategory(inc);
  const expenseCats = byCategory(exp);

  return (
    <div>
      <PageHeader title="กำไร - ขาดทุน" subtitle="สรุปรายรับ รายจ่าย และกำไรสุทธิ">
        <DateRangeFilter value={range} onChange={setRange} />
        {canEdit && (
          <ExportControls
            filename="กำไร-ขาดทุน.xlsx"
            sheetName="สรุป"
            rows={[
              { หมวดหมู่: "รายรับรวม", จำนวนเงิน: incSum },
              ...incomeCats.map((c) => ({ หมวดหมู่: `รายรับ - ${c.name}`, จำนวนเงิน: inc.filter((r) => r.category === c.name).reduce((a, b) => a + b.amount, 0) })),
              { หมวดหมู่: "รายจ่ายรวม", จำนวนเงิน: expSum },
              ...expenseCats.map((c) => ({ หมวดหมู่: `รายจ่าย - ${c.name}`, จำนวนเงิน: exp.filter((r) => r.category === c.name).reduce((a, b) => a + b.amount, 0) })),
              { หมวดหมู่: net >= 0 ? "กำไรสุทธิ" : "ขาดทุนสุทธิ", จำนวนเงิน: net },
            ]}
          />
        )}
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>รายรับรวม</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6, color: "#10B981" }}>
            {fmtBaht(incSum)}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>รายจ่ายรวม</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6, color: "#F43F5E" }}>
            {fmtBaht(expSum)}
          </div>
        </div>
        <div style={{ background: net >= 0 ? "#10B981" : "#F43F5E", color: "#fff", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, opacity: 0.8 }}>{net >= 0 ? "กำไรสุทธิ" : "ขาดทุนสุทธิ"}</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6 }}>
            {(net >= 0 ? "+" : "−") + fmtBaht(Math.abs(net)).slice(1)}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>อัตรากำไร</div>
          <div className="num" style={{ fontSize: 23, fontWeight: 600, marginTop: 6 }}>
            {margin}
          </div>
        </div>
      </div>

      <div className="dash-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "22px 24px" }}>
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
              <div style={{ height: 8, background: "#F3E8FF", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: c.pct, background: "#10B981", borderRadius: 6 }} />
              </div>
            </div>
          ))}
          {incomeCats.length === 0 && <div style={{ fontSize: 13, color: "#A996C4" }}>ไม่มีรายรับในช่วงนี้เหมียว</div>}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "22px 24px" }}>
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
              <div style={{ height: 8, background: "#F3E8FF", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: c.pct, background: "#F472B6", borderRadius: 6 }} />
              </div>
            </div>
          ))}
          {expenseCats.length === 0 && <div style={{ fontSize: 13, color: "#A996C4" }}>ไม่มีรายจ่ายในช่วงนี้เหมียว</div>}
        </div>
      </div>
    </div>
  );
}
