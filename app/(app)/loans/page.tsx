import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { LoansClient } from "./LoansClient";

export default async function LoansPage() {
  const [loans, accounts, user] = await Promise.all([
    prisma.loan.findMany({ include: { outAccount: true, inAccount: true } }),
    prisma.account.findMany({ orderBy: { createdAt: "asc" } }),
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
    transferImage: l.transferImage,
    repaymentImage: l.repaymentImage,
    outAccountName: l.outAccount?.name ?? null,
    inAccountName: l.inAccount?.name ?? null,
  }));

  return (
    <LoansClient
      loans={view}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      canEdit={user?.role === "ADMIN"}
    />
  );
}
