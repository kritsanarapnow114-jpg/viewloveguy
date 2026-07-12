"use client";

import { useState, useTransition } from "react";
import { fmtBaht } from "@/lib/format";
import { FormModal } from "./FormModal";
import { useToast } from "./ToastProvider";
import { CatFace } from "./icons/Cat";
import { createWallet, deleteWallet } from "@/app/actions/wallets";

type WalletView = { id: string; name: string; balance: number };

export function WalletsSection({ accountId, wallets, canEdit }: { accountId: string; wallets: WalletView[]; canEdit: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteWallet(id, accountId);
      showToast(res.error ?? "ลบกระเป๋าแล้ว");
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
          {wallets.map((w) => (
            <div key={w.id} style={{ position: "relative", background: "#faf6ff", border: "1px solid #ece2f7", borderRadius: 13, padding: "14px 16px" }}>
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
              <span className="cat-wiggle" style={{ width: 26, height: 26, borderRadius: 8, background: "#ece3fb", display: "grid", placeItems: "center", padding: 4, marginBottom: 8 }}>
                <CatFace accessory="monocle" />
              </span>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{w.name}</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 600 }}>
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
    </div>
  );
}
