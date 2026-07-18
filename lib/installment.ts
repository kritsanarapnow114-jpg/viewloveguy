export type InstallmentStatus = "active" | "due" | "completed";

export type InstallmentCalc = {
  status: InstallmentStatus;
  remainingMonths: number;
  remainingAmount: number;
  nextDueDate: Date;
};

export function installmentCalc(
  inst: { totalAmount: number; months: number; monthlyAmount: number; startDate: Date; paidMonths: number },
  now: Date = new Date()
): InstallmentCalc {
  const remainingMonths = Math.max(0, inst.months - inst.paidMonths);
  const remainingAmount = Math.max(0, Math.round((inst.totalAmount - inst.paidMonths * inst.monthlyAmount) * 100) / 100);
  const completed = inst.paidMonths >= inst.months;

  const nextDueDate = new Date(inst.startDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + inst.paidMonths);

  let status: InstallmentStatus = "active";
  if (completed) status = "completed";
  else if (nextDueDate.getTime() < now.getTime()) status = "due";

  return { status, remainingMonths, remainingAmount, nextDueDate };
}
