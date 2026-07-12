import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { LoansClient } from "./LoansClient";

export default async function LoansPage() {
  const [loans, user] = await Promise.all([prisma.loan.findMany(), getCurrentUser()]);

  const view = loans.map((l) => ({
    id: l.id,
    borrower: l.borrower,
    borrowDate: l.borrowDate.toISOString(),
    amount: l.amount,
    interest: l.interest,
    dueDate: l.dueDate.toISOString(),
    penalty: l.penalty,
    paid: l.paid,
  }));

  return <LoansClient loans={view} canEdit={user?.role === "ADMIN"} />;
}
