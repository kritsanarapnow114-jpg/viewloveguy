"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { walletLabel } from "@/lib/wallets";

export type InstallmentFormState = { error?: string; success?: boolean };

function revalidateAll(accountIds: (string | null | undefined)[]) {
  revalidatePath("/installments");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/expense");
  revalidatePath("/pnl");
  for (const id of accountIds) {
    if (id) revalidatePath(`/accounts/${id}`);
  }
}

async function resolveWalletLabel(label: string) {
  if (!label) return null;
  const wallets = await prisma.wallet.findMany({ include: { account: true } });
  return wallets.find((w) => walletLabel(w.account.name, w.name) === label) ?? null;
}

export async function createInstallment(_prev: InstallmentFormState, formData: FormData): Promise<InstallmentFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const item = String(formData.get("item") || "").trim();
  if (!item) return { error: "กรุณากรอกชื่อสินค้า/รายการ" };

  const totalAmount = Number(formData.get("totalAmount"));
  if (!totalAmount || totalAmount <= 0) return { error: "กรุณากรอกยอดรวมให้ถูกต้อง" };

  const months = Math.round(Number(formData.get("months")));
  if (!months || months <= 0) return { error: "กรุณากรอกจำนวนงวดให้ถูกต้อง" };

  const startDateStr = String(formData.get("startDate") || "");
  const monthlyAmount = Math.round((totalAmount / months) * 100) / 100;

  await prisma.installment.create({
    data: {
      item,
      totalAmount,
      months,
      monthlyAmount,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });

  revalidateAll([]);
  return { success: true };
}

export async function updateInstallment(id: string, _prev: InstallmentFormState, formData: FormData): Promise<InstallmentFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const item = String(formData.get("item") || "").trim();
  if (!item) return { error: "กรุณากรอกชื่อสินค้า/รายการ" };

  const totalAmount = Number(formData.get("totalAmount"));
  if (!totalAmount || totalAmount <= 0) return { error: "กรุณากรอกยอดรวมให้ถูกต้อง" };

  const months = Math.round(Number(formData.get("months")));
  if (!months || months <= 0) return { error: "กรุณากรอกจำนวนงวดให้ถูกต้อง" };

  const startDateStr = String(formData.get("startDate") || "");
  const monthlyAmount = Math.round((totalAmount / months) * 100) / 100;

  await prisma.installment.update({
    where: { id },
    data: {
      item,
      totalAmount,
      months,
      monthlyAmount,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });

  revalidateAll([]);
  return { success: true };
}

export async function payInstallment(id: string, _prev: InstallmentFormState, formData: FormData): Promise<InstallmentFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const installment = await prisma.installment.findUnique({ where: { id } });
  if (!installment) return { error: "ไม่พบรายการผ่อนชำระนี้" };
  if (installment.paidMonths >= installment.months) return { error: "ผ่อนครบแล้ว" };

  const accountName = String(formData.get("accountName") || "");
  const walletLabelValue = String(formData.get("walletLabel") || "");
  const paidDateStr = String(formData.get("paidDate") || "");

  const wallet = await resolveWalletLabel(walletLabelValue);
  const account = wallet ? wallet.account : await prisma.account.findFirst({ where: { name: accountName } });
  if (!account) return { error: "กรุณาเลือกบัญชีที่จ่าย" };

  const paidDate = paidDateStr ? new Date(paidDateStr) : new Date();
  const nextMonthNo = installment.paidMonths + 1;

  await prisma.$transaction(async (tx) => {
    const payTx = await tx.transaction.create({
      data: {
        kind: "EXPENSE",
        date: paidDate,
        category: "ผ่อนชำระสินค้า",
        note: `ผ่อน ${installment.item} งวดที่ ${nextMonthNo}/${installment.months}`,
        amount: installment.monthlyAmount,
        accountId: account.id,
        walletId: wallet?.id ?? null,
      },
    });
    await tx.installment.update({
      where: { id },
      data: {
        paidMonths: nextMonthNo,
        paymentTransactionIds: [...installment.paymentTransactionIds, payTx.id],
      },
    });
  });

  revalidateAll([account.id]);
  return { success: true };
}

export async function deleteInstallment(id: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const installment = await prisma.installment.findUnique({ where: { id } });
  if (!installment) return {};

  await prisma.$transaction(async (tx) => {
    if (installment.paymentTransactionIds.length) {
      await tx.transaction.deleteMany({ where: { id: { in: installment.paymentTransactionIds } } });
    }
    await tx.installment.delete({ where: { id } });
  });

  revalidateAll([]);
  return {};
}
