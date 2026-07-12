"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type LoanFormState = { error?: string; success?: boolean };

export async function createLoan(_prev: LoanFormState, formData: FormData): Promise<LoanFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const borrower = String(formData.get("borrower") || "").trim();
  if (!borrower) return { error: "กรุณากรอกชื่อผู้ยืม" };

  const amount = Number(formData.get("amount"));
  if (!amount || amount <= 0) return { error: "กรุณากรอกจำนวนเงินให้ถูกต้อง" };

  const interest = Number(formData.get("interest") || 0);
  const penalty = Number(formData.get("penalty") || 0);
  const borrowDate = String(formData.get("borrowDate") || "");
  const dueDate = String(formData.get("dueDate") || "");
  const transferImage = String(formData.get("transferImage") || "") || null;

  await prisma.loan.create({
    data: {
      borrower,
      amount,
      interest: Number.isFinite(interest) ? interest : 0,
      penalty: Number.isFinite(penalty) ? penalty : 0,
      borrowDate: borrowDate ? new Date(borrowDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      transferImage,
    },
  });

  revalidatePath("/loans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function payLoan(id: string, _prev: LoanFormState, formData: FormData): Promise<LoanFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const repaymentImage = String(formData.get("repaymentImage") || "") || null;

  await prisma.loan.update({
    where: { id },
    data: { paid: true, paidDate: new Date(), repaymentImage },
  });
  revalidatePath("/loans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLoan(id: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  await prisma.loan.delete({ where: { id } });
  revalidatePath("/loans");
  revalidatePath("/dashboard");
  return {};
}
