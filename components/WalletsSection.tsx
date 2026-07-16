"use client";

import { useState, useTransition } from "react";
import { fmtBaht } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { FormModal } from "./FormModal";
import { useToast } from "./ToastProvider";
import { DogSitting } from "./icons/Dog";
import { createWallet, updateWallet, deleteWallet, moveWallet } from "@/app/actions/wallets";

type WalletView = { id: string; name: string; balance: number; openingBalance: number };

export function WalletsSection({ accountId, wallets, canEdit }: { accountId: string; wallets: WalletView[]; canEdit: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletView | null>(null);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteWallet(id, accountId);
      showToast(res.error ?? "ลบกระเป๋าแล้ว");
    });
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const res = await moveWallet(id, accountId, direction);
      if (res.error) showToast(res.error);
    });
  };

  if (wallets.length === 0 && !canEdit) return null;

  return (
    <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "20px 22px", marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="mali" style={{ fontWeight: 600, fontSize: 16 }}>
          กระเป๋าย่อย
        </div>
        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            style={{ padding: "7px 14px", background: "#7c5cc4", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
          >
            + เพิ่มกระเป๋า
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div style={{ fontSize: 13, color: "#b8a9d0" }}>ยังไม่มีกระเป๋าย่อยในบัญชีนี้</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {wallets.map((w, i) => (
            <div key={w.id} style={{ position: "relative", background: "#faf6ff", border: "1px solid #ece2f7", borderRadius: 13, padding: "14px 16px" }}>
              {canEdit && (
                <div style={{ position: "absolute", left: 8, top: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                  <button
                    onClick={() => handleMove(w.id, "up")}
                    disabled={i === 0}
                    title="เลื่อนขึ้น"
                    style={{
                      border: "none",
                      background: "#f0e9fb",
                      width: 20,
                      height: 16,
                      borderRadius: "6px 6px 2px 2px",
                      cursor: i === 0 ? "default" : "pointer",
                      color: "#7c5cc4",
                      fontSize: 9,
                      opacity: i === 0 ? 0.3 : 0.75,
                      lineHeight: 1,
                    }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMove(w.id, "down")}
                    disabled={i === wallets.length - 1}
                    title="เลื่อนลง"
                    style={{
                      border: "none",
                      background: "#f0e9fb",
                      width: 20,
                      height: 16,
                      borderRadius: "2px 2px 6px 6px",
                      cursor: i === wallets.length - 1 ? "default" : "pointer",
                      color: "#7c5cc4",
                      fontSize: 9,
                      opacity: i === wallets.length - 1 ? 0.3 : 0.75,
                      lineHeight: 1,
                    }}
                  >
                    ▼
                  </button>
                </div>
              )}
              {canEdit && (
                <button
                  onClick={() => setEditingWallet(w)}
                  title="แก้ไขกระเป๋า"
                  style={{
                    position: "absolute",
                    right: 32,
                    top: 8,
                    border: "none",
                    background: "#f0e9fb",
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#7c5cc4",
                    fontSize: 9.5,
                    opacity: 0.75,
                  }}
                >
                  ✎
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => handleDelete(w.id)}
                  title="ลบกระเป๋า"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    border: "none",
                    background: "#f0e9fb",
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#d0658a",
                    fontSize: 10,
                    opacity: 0.75,
                  }}
                >
                  ✕
                </button>
              )}
              <span style={{ width: 26, height: 34, display: "block", marginTop: 30, marginBottom: 6 }}>
                <DogSitting />
              </span>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{w.name}</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 600, color: w.balance < LOW_BALANCE_THRESHOLD ? "#d0658a" : "#4fa98a" }}>
                {fmtBaht(w.balance)}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <FormModal
          title="เพิ่มกระเป๋าย่อย"
          submitLabel="บันทึก"
          successMessage="เพิ่มกระเป๋าเรียบร้อย"
          onClose={() => setModalOpen(false)}
          action={createWallet.bind(null, accountId)}
          fields={[
            { kind: "input", name: "name", label: "ชื่อกระเป๋า", placeholder: "เช่น เงินเก็บฉุกเฉิน" },
            { kind: "input", name: "openingBalance", label: "ยอดเงินตั้งต้น (บาท)", type: "number", placeholder: "0" },
          ]}
        />
      )}

      {editingWallet && (
        <FormModal
          title="แก้ไขกระเป๋าย่อย"
          submitLabel="บันทึก"
          successMessage="แก้ไขกระเป๋าเรียบร้อย"
          onClose={() => setEditingWallet(null)}
          action={updateWallet.bind(null, editingWallet.id, accountId)}
          fields={[
            { kind: "input", name: "name", label: "ชื่อกระเป๋า", placeholder: "เช่น เงินเก็บฉุกเฉิน", defaultValue: editingWallet.name },
            {
              kind: "input",
              name: "openingBalance",
              label: "ยอดเงินตั้งต้น (บาท)",
              type: "number",
              placeholder: "0",
              defaultValue: String(editingWallet.openingBalance),
            },
          ]}
        />
      )}
    </div>
  );
}
