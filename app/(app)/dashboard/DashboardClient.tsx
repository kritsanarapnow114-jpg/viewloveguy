"use client";

import { useMemo, useState } from "react";
import { fmtBaht, thDate } from "@/lib/format";
import { defaultDateRange, inDateRange, dateRangeLabel } from "@/lib/dateRange";
import { PageHeader } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { DateRangeFilter } from "@/components/DateRangeFilter";

type TxView = { id: string; date: string; note: string; category: string; accountName: string; amount: number };
type Kpi = { label: string; value: string; sub: string; subColor: string };
type Bar = { label: string; inc: number; exp: number };
type Alert = { title: string; detail: string; bg: string; dot: string };

export function DashboardClient({
  todayLabel,
  totalBalance,
  outstanding,
  outstandingCount,
  income,
  expense,
  bars,
  alerts,
  canEdit,
}: {
  todayLabel: string;
  totalBalance: number;
  outstanding: number;
  outstandingCount: number;
  income: TxView[];
  expense: TxView[];
  bars: Bar[];
  alerts: Alert[];
  canEdit: boolean;
}) {
  const [range, setRange] = useState(defaultDateRange);

  const rangeIncome = useMemo(() => income.filter((r) => inDateRange(r.date, range)), [income, range]);
  const rangeExpense = useMemo(() => expense.filter((r) => inDateRange(r.date, range)), [expense, range]);
  const rangeIncomeSum = rangeIncome.reduce((a, b) => a + b.amount, 0);
  const rangeExpenseSum = rangeExpense.reduce((a, b) => a + b.amount, 0);

  const recentTx = useMemo(
    () =>
      [...rangeIncome.map((r) => ({ ...r, kindTag: "in" as const })), ...rangeExpense.map((r) => ({ ...r, kindTag: "out" as const }))].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [rangeIncome, rangeExpense]
  );

  const rangeLabel = dateRangeLabel(range);
  const kpis: Kpi[] = [
    { label: "ยอดเงินรวมทุกบัญชี", value: fmtBaht(totalBalance), sub: "ธนาคาร + เงินสด", subColor: "#8B7CA6" },
    { label: `รายรับ (${rangeLabel})`, value: fmtBaht(rangeIncomeSum), sub: "▲ " + rangeIncome.length + " รายการ", subColor: "#10B981" },
    { label: `รายจ่าย (${rangeLabel})`, value: fmtBaht(rangeExpenseSum), sub: "▼ " + rangeExpense.length + " รายการ", subColor: "#F43F5E" },
    { label: "เงินกู้คงค้าง", value: fmtBaht(outstanding), sub: outstandingCount + " สัญญาที่ยังไม่คืน", subColor: "#8B7CA6" },
  ];

  const maxV = Math.max(1, ...bars.map((b) => b.inc), ...bars.map((b) => b.exp));

  return (
    <div>
      <PageHeader title="ภาพรวมการเงิน" subtitle={"สรุปสถานะการเงินทั้งหมด ณ วันที่ " + todayLabel}>
        <DateRangeFilter value={range} onChange={setRange} />
        {canEdit && (
          <ExportControls
            filename="รายการล่าสุด.xlsx"
            sheetName="รายการ"
            rows={recentTx.map((t) => ({
              วันที่: thDate(t.date),
              ประเภท: t.kindTag === "in" ? "รับ" : "จ่าย",
              รายการ: t.note,
              หมวดหมู่: t.category,
              บัญชี: t.accountName,
              จำนวนเงิน: t.amount,
            }))}
          />
        )}
      </PageHeader>

      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "20px 22px" }}>
            <div style={{ fontSize: 12.5, color: "#8B7CA6", fontWeight: 500 }}>{k.label}</div>
            <div className="num" style={{ fontSize: 26, fontWeight: 600, marginTop: 10, letterSpacing: "-.02em" }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12, marginTop: 7, color: k.subColor }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-cols" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div className="mali" style={{ fontWeight: 600, fontSize: 16 }}>
              รายรับ - รายจ่าย ย้อนหลัง
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "#8B7CA6" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: "#10B981" }} />
                รับ
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: "#F472B6" }} />
                จ่าย
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 190, paddingTop: 20 }}>
            {bars.map((m) => (
              <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: "100%", width: "100%", justifyContent: "center" }}>
                  <div
                    title={"รับ " + fmtBaht(m.inc)}
                    style={{
                      width: "38%",
                      maxWidth: 22,
                      height: Math.max(2, (m.inc / maxV) * 100) + "%",
                      background: "#10B981",
                      borderRadius: "6px 6px 0 0",
                      transformOrigin: "bottom",
                      animation: "growBar .5s ease",
                    }}
                  />
                  <div
                    title={"จ่าย " + fmtBaht(m.exp)}
                    style={{
                      width: "38%",
                      maxWidth: 22,
                      height: Math.max(2, (m.exp / maxV) * 100) + "%",
                      background: "#F472B6",
                      borderRadius: "6px 6px 0 0",
                      transformOrigin: "bottom",
                      animation: "growBar .5s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, color: "#8B7CA6" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "22px 24px" }}>
          <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 14 }}>
            การแจ้งเตือน
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 11, padding: 12, borderRadius: 13, background: a.bg }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.dot, marginTop: 6, flex: "0 0 8px" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#79668F", marginTop: 2, lineHeight: 1.5 }}>{a.detail}</div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 2px", color: "#8B7CA6", fontSize: 13 }}>
                ทุกอย่างเรียบร้อยดี ✓
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, padding: "22px 24px" }}>
        <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 14 }}>
          รายการล่าสุด ({rangeLabel})
        </div>
        {recentTx.slice(0, 6).map((t) => {
          const isIn = t.kindTag === "in";
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid #F3E8FF" }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  background: isIn ? "#D1FAE5" : "#FFE4E9",
                  color: isIn ? "#10B981" : "#F43F5E",
                }}
              >
                {isIn ? "+" : "−"}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.note}</div>
                <div style={{ fontSize: 11.5, color: "#8B7CA6" }}>
                  {thDate(t.date)} · {t.accountName}
                </div>
              </div>
              <div className="num" style={{ fontSize: 14, fontWeight: 600, color: isIn ? "#10B981" : "#F43F5E" }}>
                {(isIn ? "+" : "−") + fmtBaht(t.amount).slice(1)}
              </div>
            </div>
          );
        })}
        {recentTx.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 40, color: "#A996C4", fontSize: 13.5 }}>
            ไม่มีรายการในช่วงนี้
          </div>
        )}
      </div>
    </div>
  );
}
