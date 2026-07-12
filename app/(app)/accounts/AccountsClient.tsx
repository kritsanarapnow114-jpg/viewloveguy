"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { fmtBaht } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { CatFace } from "@/components/icons/Cat";
import { PageHeader, AddButton } from "@/components/PageHeader";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { createAccount, deleteAccount } from "@/app/actions/accounts";

type AccountView = {
  id: string;
  name: string;
  type: "BANK" | "CASH";
  number: string;
  balance: number;
};

export function AccountsClient({ accounts, canEdit }: { accounts: AccountView[]; canEdit: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const totalBalance = accounts.reduce((a, b) => a + b.balance, 0);
  const bankTotal = accounts.filter((a) => a.type === "BANK").reduce((a, b) => a + b.balance, 0);
  const cashTotal = accounts.filter((a) => a.type === "CASH").reduce((a, b) => a + b.balance, 0);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteAccount(id);
      showToast(res.error ?? "ลบบัญชีแล้ว");
    });
  };

  return (
    <div>
      <PageHeader title="บัญชี & เงินสด" subtitle="จัดการบัญชีธนาคารและเงินสด — คลิกที่การ์ดเพื่อดูรายการ">
        {canEdit && <AddButton label="เพิ่มบัญชี" onClick={() => setModalOpen(true)} />}
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginBottom: 18 }}>
        {accounts.map((a) => {
          const tint = a.type === "BANK" ? "#ece3fb" : "#e3f2ec";
          const low = a.balance < LOW_BALANCE_THRESHOLD;
          return (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              style={{
                background: "#fff",
                border: "1px solid #ece2f7",
                borderRadius: 18,
                padding: 22,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                display: "block",
                color: "inherit",
              }}
            >
              <div style={{ position: "absolute", right: -20, top: -20, width: 90, height: 90, borderRadius: "50%", background: tint, opacity: 0.6 }} />
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(a.id);
                  }}
                  title="ลบบัญชี"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    zIndex: 2,
                    border: "none",
                    background: "#f5f0fc",
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    cursor: "pointer",
                    color: "#d0658a",
                    fontSize: 13,
                    opacity: 0.75,
                  }}
                >
                  ✕
                </button>
              )}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: tint, display: "grid", placeItems: "center", padding: 5 }}>
                    <CatFace />
                  </span>
                  <span style={{ fontSize: 11.5, color: "#9b8fb0", fontWeight: 500 }}>{a.type === "BANK" ? "บัญชีธนาคาร" : "เงินสด"}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 16 }}>{a.name}</div>
                <div className="num" style={{ fontSize: 12, color: "#b8a9d0", marginTop: 2 }}>
                  {a.number}
                </div>
                <div className="num" style={{ fontSize: 24, fontWeight: 600, marginTop: 14, letterSpacing: "-.02em", color: low ? "#d0658a" : "#40354f" }}>
                  {fmtBaht(a.balance)}
                </div>
                <div style={{ fontSize: 11.5, color: "#b8a9d0", marginTop: 10 }}>🐾 คลิกเพื่อดูรายรับ-รายจ่าย →</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        style={{
          background: "linear-gradient(135deg,#7c5cc4,#a98fd8)",
          color: "#fff",
          borderRadius: 18,
          padding: "24px 26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "#eee3fb" }}>ยอดเงินรวมทุกบัญชี</div>
          <div className="num" style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(totalBalance)}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#eee3fb", textAlign: "right", lineHeight: 1.8 }}>
          เงินฝากธนาคาร <span className="num" style={{ color: "#fff" }}>{fmtBaht(bankTotal)}</span>
          <br />
          เงินสด <span className="num" style={{ color: "#fff" }}>{fmtBaht(cashTotal)}</span>
        </div>
      </div>

      {modalOpen && (
        <FormModal
          title="เพิ่มบัญชีใหม่"
          submitLabel="บันทึก"
          successMessage="เพิ่มบัญชีเรียบร้อย"
          onClose={() => setModalOpen(false)}
          action={createAccount}
          fields={[
            { kind: "input", name: "name", label: "ชื่อบัญชี", placeholder: "เช่น ธนาคารกรุงเทพ" },
            { kind: "select", name: "acctType", label: "ประเภท", options: ["ธนาคาร", "เงินสด"], defaultValue: "ธนาคาร" },
            { kind: "input", name: "number", label: "เลขบัญชี / หมายเหตุ", placeholder: "เช่น xxx-x-xxxxx-x" },
            { kind: "input", name: "balance", label: "ยอดเงินตั้งต้น (บาท)", type: "number", placeholder: "0" },
          ]}
        />
      )}
    </div>
  );
}
