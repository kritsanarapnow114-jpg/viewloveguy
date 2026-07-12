import { prisma } from "@/lib/prisma";
import { getAccountsWithBalance } from "@/lib/accounts";
import { loanCalc } from "@/lib/loan";
import { fmtBaht, thDate, monthKey, monthLabel, monthYearLabel } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { PageHeader } from "@/components/PageHeader";
import { CatEmpty, CatSitting } from "@/components/icons/Cat";
import { DogChaseStrip } from "@/components/DogChaseStrip";

export default async function DashboardPage() {
  const now = new Date();
  const [accounts, income, expense, loans] = await Promise.all([
    getAccountsWithBalance(),
    prisma.transaction.findMany({ where: { kind: "INCOME" }, include: { account: true } }),
    prisma.transaction.findMany({ where: { kind: "EXPENSE" }, include: { account: true } }),
    prisma.loan.findMany(),
  ]);

  const totalBalance = accounts.reduce((a, b) => a + b.balance, 0);
  const curKey = monthKey(now);
  const monthIncome = income.filter((r) => monthKey(r.date) === curKey).reduce((a, b) => a + b.amount, 0);
  const monthExpense = expense.filter((r) => monthKey(r.date) === curKey).reduce((a, b) => a + b.amount, 0);

  const loanCalcs = loans.map((l) => ({ l, c: loanCalc(l, now) }));
  const outstanding = loanCalcs.filter((x) => !x.l.paid).reduce((a, b) => a + b.l.amount, 0);

  const kpis = [
    { label: "ยอดเงินรวมทุกบัญชี", value: fmtBaht(totalBalance), sub: "ธนาคาร + เงินสด", subColor: "#9b8fb0" },
    { label: "รายรับเดือนนี้", value: fmtBaht(monthIncome), sub: "▲ " + monthYearLabel(now), subColor: "#4fa98a" },
    { label: "รายจ่ายเดือนนี้", value: fmtBaht(monthExpense), sub: "▼ " + monthYearLabel(now), subColor: "#d0658a" },
    { label: "เงินกู้คงค้าง", value: fmtBaht(outstanding), sub: loanCalcs.filter((x) => !x.l.paid).length + " สัญญาที่ยังไม่คืน", subColor: "#9b8fb0" },
  ];

  const bars: { label: string; inc: number; exp: number }[] = [];
  let maxV = 1;
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(d);
    const inc = income.filter((r) => monthKey(r.date) === k).reduce((a, b) => a + b.amount, 0);
    const exp = expense.filter((r) => monthKey(r.date) === k).reduce((a, b) => a + b.amount, 0);
    bars.push({ label: monthLabel(d), inc, exp });
    maxV = Math.max(maxV, inc, exp);
  }

  const alerts: { title: string; detail: string; bg: string; dot: string }[] = [];
  loanCalcs.forEach((x) => {
    if (x.c.status === "overdue")
      alerts.push({ title: "เกินกำหนดคืน — " + x.l.borrower, detail: "ล่าช้า " + x.c.lateDays + " วัน · ค่าปรับสะสม " + fmtBaht(x.c.fee), bg: "#fbe9f0", dot: "#d0658a" });
    else if (x.c.status === "due") alerts.push({ title: "ใกล้ครบกำหนด — " + x.l.borrower, detail: "กำหนดคืน " + thDate(x.l.dueDate), bg: "#fdf3ea", dot: "#d99a4a" });
  });
  accounts.forEach((a) => {
    if (a.balance < LOW_BALANCE_THRESHOLD) alerts.push({ title: "ยอดเงินคงเหลือต่ำ — " + a.name, detail: "คงเหลือ " + fmtBaht(a.balance), bg: "#fdf3ea", dot: "#d99a4a" });
  });

  const recentTx = [...income.map((r) => ({ ...r, kindTag: "in" as const })), ...expense.map((r) => ({ ...r, kindTag: "out" as const }))]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader title="ภาพรวมการเงิน" subtitle={"สรุปสถานะการเงินทั้งหมด ณ วันที่ " + thDate(now)} />

      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "20px 22px" }}>
            <div style={{ fontSize: 12.5, color: "#9b8fb0", fontWeight: 500 }}>{k.label}</div>
            <div className="num" style={{ fontSize: 26, fontWeight: 600, marginTop: 10, letterSpacing: "-.02em" }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12, marginTop: 7, color: k.subColor }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-cols" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div className="mali" style={{ fontWeight: 600, fontSize: 16 }}>
              รายรับ - รายจ่าย ย้อนหลัง
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "#9b8fb0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: "#5fb89a" }} />
                รับ
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: "#e39ab6" }} />
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
                      background: "#5fb89a",
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
                      background: "#e39ab6",
                      borderRadius: "6px 6px 0 0",
                      transformOrigin: "bottom",
                      animation: "growBar .5s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "22px 24px" }}>
          <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 14 }}>
            การแจ้งเตือน
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 11, padding: 12, borderRadius: 13, background: a.bg }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.dot, marginTop: 6, flex: "0 0 8px" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#7a6e90", marginTop: 2, lineHeight: 1.5 }}>{a.detail}</div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 2px", color: "#9b8fb0", fontSize: 13 }}>
                <div style={{ width: 56, height: 56 }}>
                  <CatEmpty variant="happy" />
                </div>
                ทุกอย่างเรียบร้อยดีเหมียว ✓
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "22px 24px" }}>
        <div className="mali" style={{ fontWeight: 600, fontSize: 16, marginBottom: 14 }}>
          รายการล่าสุด
        </div>
        {recentTx.map((t) => {
          const isIn = t.kindTag === "in";
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid #f4eefb" }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  background: isIn ? "#e3f2ec" : "#fbe9f0",
                  color: isIn ? "#4fa98a" : "#d0658a",
                }}
              >
                {isIn ? "+" : "−"}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.note}</div>
                <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>
                  {thDate(t.date)} · {t.account.name}
                </div>
              </div>
              <div className="num" style={{ fontSize: 14, fontWeight: 600, color: isIn ? "#4fa98a" : "#d0658a" }}>
                {(isIn ? "+" : "−") + fmtBaht(t.amount).slice(1)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 10 }}>
        <span className="cat-wiggle" style={{ width: 46, height: 60, display: "block", flex: "0 0 auto" }}>
          <CatSitting accessory="crown" />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <DogChaseStrip />
        </div>
      </div>
    </div>
  );
}
