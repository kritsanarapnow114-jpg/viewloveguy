"use client";

import { useState } from "react";
import { FormModal } from "./FormModal";
import { exchangeCash } from "@/app/actions/transfers";

export function CashExchangeButton({
  accountNames,
  walletsByAccount,
}: {
  accountNames: string[];
  walletsByAccount: Record<string, string[]>;
}) {
  const [open, setOpen] = useState(false);
  const hasWallets = Object.keys(walletsByAccount).length > 0;
  const inDefault = accountNames[0];
  const outDefault = accountNames.find((a) => a !== inDefault) ?? accountNames[0];

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
        ⇄ รับโอน-แลกเงินสด
      </button>

      {open && (
        <FormModal
          title="รับโอนเงินลูกค้า แลกเงินสด"
          submitLabel="บันทึก"
          successMessage="บันทึกรายการแลกเงินสดแล้ว"
          onClose={() => setOpen(false)}
          action={exchangeCash}
          fields={[
            { kind: "input", name: "date", label: "วันที่", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
            { kind: "input", name: "customerName", label: "ชื่อลูกค้า (ถ้ามี)", placeholder: "เช่น คุณสมชาย" },
            { kind: "select", name: "inAccountName", label: "รับโอนเข้าบัญชี", options: accountNames, defaultValue: inDefault },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "inWalletLabel",
                    label: "กระเป๋าย่อยที่รับ (ถ้ามี)",
                    dependsOn: "inAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
              : []),
            { kind: "select", name: "outAccountName", label: "จ่ายเงินสดจากบัญชี", options: accountNames, defaultValue: outDefault },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "outWalletLabel",
                    label: "กระเป๋าย่อยที่จ่าย (ถ้ามี)",
                    dependsOn: "outAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
              : []),
            { kind: "input", name: "amount", label: "จำนวนเงิน (บาท)", type: "number", placeholder: "0" },
          ]}
        />
      )}
    </>
  );
}
