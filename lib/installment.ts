export type InstallmentStatus = "active" | "due" | "completed";

export type InstallmentCalc = {
  status: InstallmentStatus;
  remainingMonths: number;
  remainingAmount: number;
  nextDueDate: Date;
  nextPaymentAmount: number;
};

/**
 * The amount due for a given installment number. Every month pays the flat
 * monthlyAmount except the last, which absorbs whatever rounding remainder
 * is left so the payments always sum exactly to totalAmount — matching how
 * real installment plans (e.g. Shopee) round.
 */
export function installmentPaymentAmount(inst: { totalAmount: number; months: number; monthlyAmount: number }, monthNo: number): number {
  if (monthNo >= inst.months) {
    return Math.round((inst.totalAmount - inst.monthlyAmount * (inst.months - 1)) * 100) / 100;
  }
  return inst.monthlyAmount;
}

export function installmentCalc(
  inst: { totalAmount: number; months: number; monthlyAmount: number; startDate: Date; paidMonths: number },
  now: Date = new Date()
): InstallmentCalc {
  const remainingMonths = Math.max(0, inst.months - inst.paidMonths);
  const completed = inst.paidMonths >= inst.months;
  const remainingAmount = completed ? 0 : Math.max(0, Math.round((inst.totalAmount - inst.paidMonths * inst.monthlyAmount) * 100) / 100);
  const nextPaymentAmount = completed ? 0 : installmentPaymentAmount(inst, inst.paidMonths + 1);

  const nextDueDate = new Date(inst.startDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + inst.paidMonths);

  let status: InstallmentStatus = "active";
  if (completed) status = "completed";
  else if (nextDueDate.getTime() < now.getTime()) status = "due";

  return { status, remainingMonths, remainingAmount, nextDueDate, nextPaymentAmount };
}
