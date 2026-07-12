"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { fmtBaht } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { CatSitting, type CatAccessory } from "@/components/icons/Cat";
import { PageHeader, AddButton } from "@/components/PageHeader";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { createAccount, updateAccount, deleteAccount } from "@/app/actions/accounts";
import { PageMascots } from "@/components/PageMascots";

const ACCESSORIES: CatAccessory[] = ["heroRed", "heroBlue", "heroGreen", "heroPurple", "heroGold", "heroBlack"];
const POSES: ("sit" | "stand" | "wave")[] = ["stand", "wave", "sit"];

type AccountView = {
  id: string;
  name: string;
  type: "BANK" | "CASH";
  number: string;
  balance: number;
  openingBalance: number;
};

export function AccountsClient({ accounts, canEdit }: { accounts: AccountView[]; canEdit: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountView | null>(null);
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 18 }}>
        {accounts.map((a, i) => {
          const tint = a.type === "BANK" ? "#ece3fb" : "#e3f2ec";
          const low = a.balance < LOW_BALANCE_THRESHOLD;
          const accessory = ACCESSORIES[i % ACCESSORIES.length];
          const pose = POSES[i % POSES.length];
          return (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              style={{
                background: "#fff",
                border: "1px solid #ece2f7",
                borderRadius: 15,
                padding: 15,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                display: "block",
                color: "inherit",
              }}
            >
              <div style={{ position: "absolute", right: -16, top: -16, width: 66, height: 66, borderRadius: "50%", background: tint, opacity: 0.6 }} />
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingAccount(a);
                  }}
                  title="แก้ไขบัญชี"
                  style={{
                    position: "absolute",
                    right: 36,
                    top: 9,
                    zIndex: 2,
                    border: "none",
                    background: "#f5f0fc",
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#7c5cc4",
                    fontSize: 10.5,
                    opacity: 0.75,
                  }}
                >
                  ✎
                </button>
              )}
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
                    right: 9,
                    top: 9,
                    zIndex: 2,
                    border: "none",
                    background: "#f5f0fc",
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#d0658a",
                    fontSize: 11.5,
                    opacity: 0.75,
                  }}
                >
                  ✕
                </button>
              )}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 34, height: 45, display: "block" }}>
                    <CatSitting accessory={accessory} pose={pose} />
                  </span>
                  <span style={{ fontSize: 10.5, color: "#9b8fb0", fontWeight: 500 }}>{a.type === "BANK" ? "บัญชีธนาคาร" : "เงินสด"}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <div className="num" style={{ fontSize: 11, color: "#b8a9d0", marginTop: 1 }}>
                  {a.number}
                </div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 9, letterSpacing: "-.02em", color: low ? "#d0658a" : "#40354f" }}>
                  {fmtBaht(a.balance)}
                </div>
                <div style={{ fontSize: 10.5, color: "#b8a9d0", marginTop: 7 }}>🐾 ดูรายการ →</div>
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

      {editingAccount && (
        <FormModal
          title="แก้ไขบัญชี"
          submitLabel="บันทึก"
          successMessage="แก้ไขบัญชีเรียบร้อย"
          onClose={() => setEditingAccount(null)}
          action={updateAccount.bind(null, editingAccount.id)}
          fields={[
            { kind: "input", name: "name", label: "ชื่อบัญชี", placeholder: "เช่น ธนาคารกรุงเทพ", defaultValue: editingAccount.name },
            {
              kind: "select",
              name: "acctType",
              label: "ประเภท",
              options: ["ธนาคาร", "เงินสด"],
              defaultValue: editingAccount.type === "BANK" ? "ธนาคาร" : "เงินสด",
            },
            { kind: "input", name: "number", label: "เลขบัญชี / หมายเหตุ", placeholder: "เช่น xxx-x-xxxxx-x", defaultValue: editingAccount.number },
            {
              kind: "input",
              name: "balance",
              label: "ยอดเงินตั้งต้น (บาท)",
              type: "number",
              placeholder: "0",
              defaultValue: String(editingAccount.openingBalance),
            },
          ]}
        />
      )}

      <PageMascots accessory="heroBlue" pose="wave" />
    </div>
  );
}
