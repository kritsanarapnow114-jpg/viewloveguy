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

  const amounts = parseAmounts(formData.get("amounts"));
  if (!amounts) return { error: "กรุณากรอกยอดผ่อนแต่ละงวดให้ถูกต้อง (ทุกงวดต้องมากกว่า 0)" };

  const startDateStr = String(formData.get("startDate") || "");
  const totalAmount = Math.round(amounts.reduce((a, b) => a + b, 0) * 100) / 100;

  await prisma.installment.create({
    data: {
      item,
      totalAmount,
      months: amounts.length,
      amounts,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });

  revalidateAll([]);
  return { success: true };
}

function parseAmounts(raw: FormDataEntryValue | null): number[] | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(raw));
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return null;
  const amounts = parsed.map((v) => Number(v));
  if (amounts.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  return amounts.map((n) => Math.round(n * 100) / 100);
}

export async function updateInstallment(id: string, _prev: InstallmentFormState, formData: FormData): Promise<InstallmentFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const existing = await prisma.installment.findUnique({ where: { id } });
  if (!existing) return { error: "ไม่พบรายการผ่อนชำระนี้" };

  const item = String(formData.get("item") || "").trim();
  if (!item) return { error: "กรุณากรอกชื่อสินค้า/รายการ" };

  const amounts = parseAmounts(formData.get("amounts"));
  if (!amounts) return { error: "กรุณากรอกยอดผ่อนแต่ละงวดให้ถูกต้อง (ทุกงวดต้องมากกว่า 0)" };
  if (amounts.length < existing.paidMonths) return { error: "จำนวนงวดต้องไม่น้อยกว่างวดที่จ่ายไปแล้ว" };

  const startDateStr = String(formData.get("startDate") || "");
  const totalAmount = Math.round(amounts.reduce((a, b) => a + b, 0) * 100) / 100;

  await prisma.installment.update({
    where: { id },
    data: {
      item,
      totalAmount,
      months: amounts.length,
      amounts,
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
  const payAmount = installment.amounts[installment.paidMonths];

  await prisma.$transaction(async (tx) => {
    const payTx = await tx.transaction.create({
      data: {
        kind: "EXPENSE",
        date: paidDate,
        category: "ผ่อนชำระสินค้า",
        note: `ผ่อน ${installment.item} งวดที่ ${nextMonthNo}/${installment.months}`,
        amount: payAmount,
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
