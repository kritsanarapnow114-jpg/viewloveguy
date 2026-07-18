"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { walletLabel } from "@/lib/wallets";

export type TransferFormState = { error?: string; success?: boolean };

async function resolveWalletLabel(label: string) {
  if (!label) return null;
  const wallets = await prisma.wallet.findMany({ include: { account: true } });
  return wallets.find((w) => walletLabel(w.account.name, w.name) === label) ?? null;
}

function revalidateAll(accountIds: (string | null | undefined)[]) {
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/pnl");
  for (const id of accountIds) {
    if (id) revalidatePath(`/accounts/${id}`);
  }
}

export async function transferFunds(_prev: TransferFormState, formData: FormData): Promise<TransferFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const amount = Number(formData.get("amount"));
  if (!amount || amount <= 0) return { error: "กรุณากรอกจำนวนเงินให้ถูกต้อง" };

  const dateStr = String(formData.get("date") || "");
  const note = String(formData.get("note") || "").trim();
  const fromAccountName = String(formData.get("fromAccountName") || "");
  const fromWalletLabel = String(formData.get("fromWalletLabel") || "");
  const toAccountName = String(formData.get("toAccountName") || "");
  const toWalletLabel = String(formData.get("toWalletLabel") || "");

  const fromWallet = await resolveWalletLabel(fromWalletLabel);
  const fromAccount = fromWallet ? fromWallet.account : await prisma.account.findFirst({ where: { name: fromAccountName } });
  if (!fromAccount) return { error: "กรุณาเลือกบัญชีต้นทาง" };

  const toWallet = await resolveWalletLabel(toWalletLabel);
  const toAccount = toWallet ? toWallet.account : await prisma.account.findFirst({ where: { name: toAccountName } });
  if (!toAccount) return { error: "กรุณาเลือกบัญชีปลายทาง" };

  if (fromAccount.id === toAccount.id && (fromWallet?.id ?? null) === (toWallet?.id ?? null)) {
    return { error: "บัญชี/กระเป๋าต้นทางและปลายทางต้องไม่ใช่จุดเดียวกัน" };
  }

  const date = dateStr ? new Date(dateStr) : new Date();
  const fromLabel = fromWallet ? walletLabel(fromAccount.name, fromWallet.name) : fromAccount.name;
  const toLabel = toWallet ? walletLabel(toAccount.name, toWallet.name) : toAccount.name;

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        kind: "EXPENSE",
        date,
        category: "โอนไปยังบัญชีอื่น",
        note: note || `โอนไปยัง ${toLabel}`,
        amount,
        accountId: fromAccount.id,
        walletId: fromWallet?.id ?? null,
      },
    }),
    prisma.transaction.create({
      data: {
        kind: "INCOME",
        date,
        category: "โอนจากบัญชีอื่น",
        note: note || `โอนจาก ${fromLabel}`,
        amount,
        accountId: toAccount.id,
        walletId: toWallet?.id ?? null,
      },
    }),
  ]);

  revalidateAll([fromAccount.id, toAccount.id]);
  return { success: true };
}
