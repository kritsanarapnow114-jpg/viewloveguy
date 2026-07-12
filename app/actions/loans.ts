"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { loanCalc } from "@/lib/loan";

export type LoanFormState = { error?: string; success?: boolean };

function revalidateAll(accountIds: (string | null | undefined)[]) {
  revalidatePath("/loans");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/pnl");
  for (const id of accountIds) {
    if (id) revalidatePath(`/accounts/${id}`);
  }
}

export async function createLoan(_prev: LoanFormState, formData: FormData): Promise<LoanFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const borrower = String(formData.get("borrower") || "").trim();
  if (!borrower) return { error: "กรุณากรอกชื่อผู้ยืม" };

  const amount = Number(formData.get("amount"));
  if (!amount || amount <= 0) return { error: "กรุณากรอกจำนวนเงินให้ถูกต้อง" };

  const interest = Number(formData.get("interest") || 0);
  const penalty = Number(formData.get("penalty") || 0);
  const borrowDateStr = String(formData.get("borrowDate") || "");
  const dueDate = String(formData.get("dueDate") || "");
  const transferImage = String(formData.get("transferImage") || "") || null;
  const outAccountName = String(formData.get("outAccountName") || "");

  const outAccount = await prisma.account.findFirst({ where: { name: outAccountName } });
  if (!outAccount) return { error: "กรุณาเลือกบัญชีที่โอนออก" };

  const borrowDate = borrowDateStr ? new Date(borrowDateStr) : new Date();

  await prisma.$transaction(async (tx) => {
    const loan = await tx.loan.create({
      data: {
        borrower,
        amount,
        interest: Number.isFinite(interest) ? interest : 0,
        penalty: Number.isFinite(penalty) ? penalty : 0,
        borrowDate,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        transferImage,
        outAccountId: outAccount.id,
      },
    });
    const outTx = await tx.transaction.create({
      data: {
        kind: "EXPENSE",
        date: borrowDate,
        category: "ปล่อยเงินกู้",
        note: `ปล่อยกู้ - ${borrower}`,
        amount,
        accountId: outAccount.id,
      },
    });
    await tx.loan.update({ where: { id: loan.id }, data: { outTransactionId: outTx.id } });
  });

  revalidateAll([outAccount.id]);
  return { success: true };
}

export async function payLoan(id: string, _prev: LoanFormState, formData: FormData): Promise<LoanFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) return { error: "ไม่พบสัญญาเงินกู้นี้" };

  const repaymentImage = String(formData.get("repaymentImage") || "") || null;
  const inAccountName = String(formData.get("inAccountName") || "");

  const inAccount = await prisma.account.findFirst({ where: { name: inAccountName } });
  if (!inAccount) return { error: "กรุณาเลือกบัญชีที่รับเงินเข้า" };

  const { fee } = loanCalc(loan);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const principalTx = await tx.transaction.create({
      data: {
        kind: "INCOME",
        date: now,
        category: "รับชำระหนี้",
        note: `รับคืนเงินต้น - ${loan.borrower}`,
        amount: loan.amount,
        accountId: inAccount.id,
      },
    });
    const txIds = [principalTx.id];

    const interestPlusFee = loan.interest + fee;
    if (interestPlusFee > 0) {
      const interestTx = await tx.transaction.create({
        data: {
          kind: "INCOME",
          date: now,
          category: "ดอกเบี้ยเงินกู้",
          note: fee > 0 ? `ดอกเบี้ยรับ (รวมค่าปรับล่าช้า) - ${loan.borrower}` : `ดอกเบี้ยรับ - ${loan.borrower}`,
          amount: interestPlusFee,
          accountId: inAccount.id,
        },
      });
      txIds.push(interestTx.id);
    }

    await tx.loan.update({
      where: { id },
      data: { paid: true, paidDate: now, repaymentImage, inAccountId: inAccount.id, inTransactionIds: txIds },
    });
  });

  revalidateAll([loan.outAccountId, inAccount.id]);
  return { success: true };
}

export async function deleteLoan(id: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) return {};

  const txIds = [loan.outTransactionId, ...loan.inTransactionIds].filter((v): v is string => !!v);

  await prisma.$transaction(async (tx) => {
    if (txIds.length) await tx.transaction.deleteMany({ where: { id: { in: txIds } } });
    await tx.loan.delete({ where: { id } });
  });

  revalidateAll([loan.outAccountId, loan.inAccountId]);
  return {};
}
