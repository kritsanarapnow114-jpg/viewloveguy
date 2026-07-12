export type LoanStatus = "active" | "due" | "overdue" | "paid";

export type LoanCalc = {
  status: LoanStatus;
  lateDays: number;
  fee: number;
  total: number;
};

const DAY_MS = 86400000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function loanCalc(
  loan: { amount: number; interest: number; dueDate: Date; penalty: number; paid: boolean },
  now: Date = new Date()
): LoanCalc {
  const due = startOfDay(loan.dueDate);
  const today = startOfDay(now);
  let status: LoanStatus = "active";
  let lateDays = 0;
  let fee = 0;

  if (loan.paid) {
    status = "paid";
  } else {
    const diff = Math.floor((due.getTime() - today.getTime()) / DAY_MS);
    if (diff < 0) {
      status = "overdue";
      lateDays = -diff;
      fee = loan.penalty * lateDays;
    } else if (diff <= 7) {
      status = "due";
    }
  }

  return { status, lateDays, fee, total: loan.amount + loan.interest + fee };
}
