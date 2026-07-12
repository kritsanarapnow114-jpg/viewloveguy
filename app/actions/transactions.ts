"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type TxFormState = { error?: string; success?: boolean };
export type TxKind = "income" | "expense";

function revalidateLedgerPaths(accountId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/income");
  revalidatePath("/expense");
  revalidatePath("/pnl");
}

export async function createTransaction(kind: TxKind, _prev: TxFormState, formData: FormData): Promise<TxFormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  const amount = Number(formData.get("amount"));
  if (!amount || amount <= 0) return { error: "กรุณากรอกจำนวนเงินให้ถูกต้อง" };

  const note = String(formData.get("note") || "").trim();
  if (!note) return { error: "กรุณากรอกรายละเอียดรายการ" };

  const category = String(formData.get("category") || "");
  const accountName = String(formData.get("accountName") || "");
  const dateStr = String(formData.get("date") || "");
  const account = await prisma.account.findFirst({ where: { name: accountName } });
  if (!account) return { error: "กรุณาเลือกบัญชี" };
  const accountId = account.id;

  await prisma.transaction.create({
    data: {
      kind: kind === "income" ? "INCOME" : "EXPENSE",
      date: dateStr ? new Date(dateStr) : new Date(),
      category,
      note,
      amount,
      accountId,
    },
  });

  revalidateLedgerPaths(accountId);
  return { success: true };
}

export async function deleteTransaction(id: string, accountId: string): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "ไม่มีสิทธิ์ทำรายการนี้" };

  await prisma.transaction.delete({ where: { id } });
  revalidateLedgerPaths(accountId);
  return {};
}
