"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type AccountFormState = { error?: string; success?: boolean };

export async function createAccount(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "กรุณากรอกชื่อบัญชี" };

  const acctType = String(formData.get("acctType") || "ธนาคาร");
  const isBank = acctType === "ธนาคาร";
  const number = String(formData.get("number") || "").trim();
  const balance = Number(formData.get("balance") || 0);

  await prisma.account.create({
    data: {
      name,
      type: isBank ? "BANK" : "CASH",
      number: number || (isBank ? "-" : "เงินสด"),
      openingBalance: Number.isFinite(balance) ? balance : 0,
    },
  });

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAccount(id: string, _prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "กรุณากรอกชื่อบัญชี" };

  const acctType = String(formData.get("acctType") || "ธนาคาร");
  const isBank = acctType === "ธนาคาร";
  const number = String(formData.get("number") || "").trim();
  const balance = Number(formData.get("balance") || 0);

  await prisma.account.update({
    where: { id },
    data: {
      name,
      type: isBank ? "BANK" : "CASH",
      number: number || (isBank ? "-" : "เงินสด"),
      openingBalance: Number.isFinite(balance) ? balance : 0,
    },
  });

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/pnl");
  return { success: true };
}

export async function reorderAccounts(ids: string[]): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  await prisma.$transaction(ids.map((id, i) => prisma.account.update({ where: { id }, data: { order: i } })));

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteAccount(id: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const [txCount, walletCount, totalAccounts] = await Promise.all([
    prisma.transaction.count({ where: { accountId: id } }),
    prisma.wallet.count({ where: { accountId: id } }),
    prisma.account.count(),
  ]);
  if (txCount > 0) return { error: "ลบไม่ได้ — บัญชีนี้มีรายการอยู่" };
  if (walletCount > 0) return { error: "ลบไม่ได้ — บัญชีนี้มีกระเป๋าย่อยอยู่ กรุณาลบกระเป๋าก่อน" };
  if (totalAccounts <= 1) return { error: "ต้องมีอย่างน้อย 1 บัญชี" };

  await prisma.account.delete({ where: { id } });
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return {};
}
