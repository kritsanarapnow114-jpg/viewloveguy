import { prisma } from "./prisma";

export async function getAccountsWithBalance() {
  const accounts = await prisma.account.findMany({
    include: { transactions: true },
    orderBy: { createdAt: "asc" },
  });
  return accounts.map((a) => {
    const income = a.transactions.filter((t) => t.kind === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = a.transactions.filter((t) => t.kind === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    return { ...a, balance: a.openingBalance + income - expense };
  });
}

export async function getAccountWithBalance(id: string) {
  const accounts = await getAccountsWithBalance();
  return accounts.find((a) => a.id === id) ?? null;
}
