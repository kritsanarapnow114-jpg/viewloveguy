import { prisma } from "./prisma";

export function walletLabel(accountName: string, walletName: string) {
  return `${accountName} · ${walletName}`;
}

export async function getWalletLabels() {
  const wallets = await prisma.wallet.findMany({ include: { account: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return wallets.map((w) => walletLabel(w.account.name, w.name));
}

/** Wallet labels grouped by their account's name, for account-then-wallet dependent selects. */
export async function getWalletsByAccount(): Promise<Record<string, string[]>> {
  const wallets = await prisma.wallet.findMany({ include: { account: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const grouped: Record<string, string[]> = {};
  for (const w of wallets) {
    (grouped[w.account.name] ??= []).push(walletLabel(w.account.name, w.name));
  }
  return grouped;
}

export async function getWalletsWithBalance(accountId?: string) {
  const wallets = await prisma.wallet.findMany({
    where: accountId ? { accountId } : undefined,
    include: { transactions: true, account: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return wallets.map((w) => {
    const income = w.transactions.filter((t) => t.kind === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = w.transactions.filter((t) => t.kind === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    return { ...w, balance: w.openingBalance + income - expense };
  });
}
