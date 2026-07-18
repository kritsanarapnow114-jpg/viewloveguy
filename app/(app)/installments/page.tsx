import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getWalletsByAccount } from "@/lib/wallets";
import { InstallmentsClient } from "./InstallmentsClient";

export default async function InstallmentsPage() {
  const [installments, accounts, walletsByAccount, user] = await Promise.all([
    prisma.installment.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.account.findMany({ orderBy: { createdAt: "asc" } }),
    getWalletsByAccount(),
    getCurrentUser(),
  ]);

  const view = installments.map((i) => ({
    id: i.id,
    item: i.item,
    totalAmount: i.totalAmount,
    months: i.months,
    amounts: i.amounts,
    startDate: i.startDate.toISOString(),
    paidMonths: i.paidMonths,
  }));

  return (
    <InstallmentsClient
      installments={view}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      walletsByAccount={walletsByAccount}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
