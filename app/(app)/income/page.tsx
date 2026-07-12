import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { thDate } from "@/lib/format";
import { INCOME_CATEGORIES } from "@/lib/constants";
import { getWalletLabels } from "@/lib/wallets";
import { LedgerClient } from "@/components/LedgerClient";

export default async function IncomePage() {
  const [txs, accounts, walletLabels, user] = await Promise.all([
    prisma.transaction.findMany({ where: { kind: "INCOME" }, include: { account: true }, orderBy: { date: "desc" } }),
    prisma.account.findMany({ orderBy: { createdAt: "asc" } }),
    getWalletLabels(),
    getCurrentUser(),
  ]);

  const rows = txs.map((t) => ({
    id: t.id,
    dateText: thDate(t.date),
    date: t.date.toISOString(),
    note: t.note,
    category: t.category,
    accountId: t.accountId,
    accountName: t.account.name,
    amount: t.amount,
  }));

  return (
    <LedgerClient
      kind="income"
      rows={rows}
      categories={INCOME_CATEGORIES}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      walletLabels={walletLabels}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
