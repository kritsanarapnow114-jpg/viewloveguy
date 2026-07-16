"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type WalletFormState = { error?: string; success?: boolean };

export async function createWallet(accountId: string, _prev: WalletFormState, formData: FormData): Promise<WalletFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "กรุณากรอกชื่อกระเป๋า" };

  const openingBalance = Number(formData.get("openingBalance") || 0);

  await prisma.wallet.create({
    data: { name, accountId, openingBalance: Number.isFinite(openingBalance) ? openingBalance : 0 },
  });

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/loans");
  return { success: true };
}

export async function updateWallet(id: string, accountId: string, _prev: WalletFormState, formData: FormData): Promise<WalletFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "กรุณากรอกชื่อกระเป๋า" };

  const openingBalance = Number(formData.get("openingBalance") || 0);

  await prisma.wallet.update({
    where: { id },
    data: { name, openingBalance: Number.isFinite(openingBalance) ? openingBalance : 0 },
  });

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/loans");
  return { success: true };
}

export async function reorderWallets(accountId: string, ids: string[]): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  await prisma.$transaction(ids.map((id, i) => prisma.wallet.update({ where: { id }, data: { order: i } })));

  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");
  return {};
}

export async function deleteWallet(id: string, accountId: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const txCount = await prisma.transaction.count({ where: { walletId: id } });
  if (txCount > 0) return { error: "ลบไม่ได้ — กระเป๋านี้มีรายการอยู่" };

  await prisma.wallet.delete({ where: { id } });
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/loans");
  return {};
}
