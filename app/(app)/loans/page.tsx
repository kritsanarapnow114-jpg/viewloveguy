import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getWalletsByAccount } from "@/lib/wallets";
import { LoansClient } from "./LoansClient";

export default async function LoansPage() {
  const [loans, accounts, walletsByAccount, user] = await Promise.all([
    prisma.loan.findMany({ include: { outAccount: true, outWallet: true, inAccount: true, inWallet: true } }),
    prisma.account.findMany({ orderBy: { createdAt: "asc" } }),
    getWalletsByAccount(),
    getCurrentUser(),
  ]);

  const view = loans.map((l) => ({
    id: l.id,
    borrower: l.borrower,
    borrowDate: l.borrowDate.toISOString(),
    amount: l.amount,
    interest: l.interest,
    dueDate: l.dueDate.toISOString(),
    penalty: l.penalty,
    paid: l.paid,
    paidDate: l.paidDate ? l.paidDate.toISOString() : null,
    transferImage: l.transferImage,
    transferImage2: l.transferImage2,
    repaymentImage: l.repaymentImage,
    outAccountName: l.outAccount?.name ?? null,
    outWalletName: l.outWallet?.name ?? null,
    inAccountName: l.inAccount?.name ?? null,
    inWalletName: l.inWallet?.name ?? null,
  }));

  return (
    <LoansClient
      loans={view}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      walletsByAccount={walletsByAccount}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
