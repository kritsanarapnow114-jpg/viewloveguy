import { prisma } from "@/lib/prisma";
import { getAccountsWithBalance } from "@/lib/accounts";
import { getCurrentUser } from "@/lib/session";
import { AccountsClient } from "./AccountsClient";

export default async function AccountsPage() {
  const [accounts, unpaidLoans, user] = await Promise.all([
    getAccountsWithBalance(),
    prisma.loan.findMany({ where: { paid: false } }),
    getCurrentUser(),
  ]);

  const view = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    number: a.number,
    balance: a.balance,
    openingBalance: a.openingBalance,
  }));

  const outstandingLoans = unpaidLoans.reduce((a, b) => a + b.amount, 0);
  const outstandingLoanCount = unpaidLoans.length;

  return (
    <AccountsClient accounts={view} outstandingLoans={outstandingLoans} outstandingLoanCount={outstandingLoanCount} canEdit={user?.role === "ADMIN"} />
  );
}
