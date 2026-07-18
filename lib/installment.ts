export type InstallmentStatus = "active" | "due" | "completed";

export type InstallmentCalc = {
  status: InstallmentStatus;
  remainingMonths: number;
  remainingAmount: number;
  nextDueDate: Date;
  nextPaymentAmount: number;
};

export function installmentCalc(
  inst: { amounts: number[]; startDate: Date; paidMonths: number },
  now: Date = new Date()
): InstallmentCalc {
  const months = inst.amounts.length;
  const remainingMonths = Math.max(0, months - inst.paidMonths);
  const completed = inst.paidMonths >= months;
  const remainingAmount = completed
    ? 0
    : Math.round(inst.amounts.slice(inst.paidMonths).reduce((a, b) => a + b, 0) * 100) / 100;
  const nextPaymentAmount = completed ? 0 : inst.amounts[inst.paidMonths];

  const nextDueDate = new Date(inst.startDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + inst.paidMonths);

  let status: InstallmentStatus = "active";
  if (completed) status = "completed";
  else if (nextDueDate.getTime() < now.getTime()) status = "due";

  return { status, remainingMonths, remainingAmount, nextDueDate, nextPaymentAmount };
}

/** Quick equal-split helper: divides totalAmount into `months` payments, with the
 * last one absorbing the rounding remainder. Used to pre-fill a per-month schedule
 * that the user can then adjust to match a real (often uneven) plan. */
export function splitEqually(totalAmount: number, months: number): number[] {
  if (months <= 0) return [];
  const monthly = Math.round((totalAmount / months) * 100) / 100;
  const amounts = Array(months).fill(monthly);
  amounts[months - 1] = Math.round((totalAmount - monthly * (months - 1)) * 100) / 100;
  return amounts;
}
