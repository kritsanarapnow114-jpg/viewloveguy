import { prisma } from "@/lib/prisma";
import { getAccountsWithBalance } from "@/lib/accounts";
import { getCurrentUser } from "@/lib/session";
import { loanCalc } from "@/lib/loan";
import { fmtBaht, thDate, monthKey, monthLabel } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const now = new Date();
  const [accounts, income, expense, loans, user] = await Promise.all([
    getAccountsWithBalance(),
    prisma.transaction.findMany({ where: { kind: "INCOME" }, include: { account: true } }),
    prisma.transaction.findMany({ where: { kind: "EXPENSE" }, include: { account: true } }),
    prisma.loan.findMany(),
    getCurrentUser(),
  ]);

  const totalBalance = accounts.reduce((a, b) => a + b.balance, 0);

  const loanCalcs = loans.map((l) => ({ l, c: loanCalc(l, now) }));
  const outstanding = loanCalcs.filter((x) => !x.l.paid).reduce((a, b) => a + b.l.amount, 0);
  const outstandingCount = loanCalcs.filter((x) => !x.l.paid).length;

  const bars: { label: string; inc: number; exp: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(d);
    const inc = income.filter((r) => monthKey(r.date) === k).reduce((a, b) => a + b.amount, 0);
    const exp = expense.filter((r) => monthKey(r.date) === k).reduce((a, b) => a + b.amount, 0);
    bars.push({ label: monthLabel(d), inc, exp });
  }

  const alerts: { title: string; detail: string; bg: string; dot: string }[] = [];
  loanCalcs.forEach((x) => {
    if (x.c.status === "overdue")
      alerts.push({
        title: "เกินกำหนดคืน — " + x.l.borrower,
        detail: "ล่าช้า " + x.c.lateDays + " วัน · ค่าปรับสะสม " + fmtBaht(x.c.fee),
        bg: "#fbe9f0",
        dot: "#d0658a",
      });
    else if (x.c.status === "due") alerts.push({ title: "ใกล้ครบกำหนด — " + x.l.borrower, detail: "กำหนดคืน " + thDate(x.l.dueDate), bg: "#fdf3ea", dot: "#d99a4a" });
  });
  accounts.forEach((a) => {
    if (a.balance < LOW_BALANCE_THRESHOLD) alerts.push({ title: "ยอดเงินคงเหลือต่ำ — " + a.name, detail: "คงเหลือ " + fmtBaht(a.balance), bg: "#fdf3ea", dot: "#d99a4a" });
  });

  const toTxView = (t: (typeof income)[number]) => ({
    id: t.id,
    date: t.date.toISOString(),
    note: t.note,
    category: t.category,
    accountName: t.account.name,
    amount: t.amount,
  });

  return (
    <DashboardClient
      todayLabel={thDate(now)}
      totalBalance={totalBalance}
      outstanding={outstanding}
      outstandingCount={outstandingCount}
      income={income.map(toTxView)}
      expense={expense.map(toTxView)}
      bars={bars}
      alerts={alerts}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
