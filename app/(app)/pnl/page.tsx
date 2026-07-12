import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { PnlClient } from "./PnlClient";

export default async function PnlPage() {
  const [income, expense, user] = await Promise.all([
    prisma.transaction.findMany({ where: { kind: "INCOME" } }),
    prisma.transaction.findMany({ where: { kind: "EXPENSE" } }),
    getCurrentUser(),
  ]);

  return (
    <PnlClient
      income={income.map((t) => ({ date: t.date.toISOString(), category: t.category, amount: t.amount }))}
      expense={expense.map((t) => ({ date: t.date.toISOString(), category: t.category, amount: t.amount }))}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
