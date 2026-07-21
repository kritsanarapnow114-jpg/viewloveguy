"use client";

import { useState } from "react";
import { FormModal } from "./FormModal";
import { transferFunds } from "@/app/actions/transfers";

export function TransferButton({
  accountNames,
  walletsByAccount,
  defaultFromAccountName,
}: {
  accountNames: string[];
  walletsByAccount: Record<string, string[]>;
  defaultFromAccountName?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasWallets = Object.keys(walletsByAccount).length > 0;
  const fromDefault = defaultFromAccountName ?? accountNames[0];
  const toDefault = accountNames.find((a) => a !== fromDefault) ?? accountNames[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 16px",
          background: "#fff",
          color: "#8B5CF6",
          border: "1px solid #DCC4FA",
          borderRadius: 11,
          fontSize: 13.5,
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        ⇄ โอนเงิน
      </button>

      {open && (
        <FormModal
          title="โอนย้ายเงิน"
          submitLabel="โอนเงิน"
          successMessage="โอนเงินเรียบร้อย"
          onClose={() => setOpen(false)}
          action={transferFunds}
          fields={[
            { kind: "input", name: "date", label: "วันที่โอน", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
            { kind: "select", name: "fromAccountName", label: "จากบัญชี", options: accountNames, defaultValue: fromDefault },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "fromWalletLabel",
                    label: "จากกระเป๋าย่อย (ถ้ามี)",
                    dependsOn: "fromAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
              : []),
            { kind: "select", name: "toAccountName", label: "ไปบัญชี", options: accountNames, defaultValue: toDefault },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "toWalletLabel",
                    label: "ไปกระเป๋าย่อย (ถ้ามี)",
                    dependsOn: "toAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
              : []),
            { kind: "input", name: "amount", label: "จำนวนเงิน (บาท)", type: "number", placeholder: "0" },
            { kind: "input", name: "note", label: "หมายเหตุ (ถ้ามี)", placeholder: "เช่น โอนเก็บออม" },
          ]}
        />
      )}
    </>
  );
}
