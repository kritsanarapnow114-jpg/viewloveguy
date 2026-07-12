"use client";

import { useMemo, useState, useTransition } from "react";
import { fmtBaht, thDate } from "@/lib/format";
import { loanCalc, type LoanStatus } from "@/lib/loan";
import { PageHeader, SearchBox, AddButton } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { createLoan, payLoan, deleteLoan } from "@/app/actions/loans";

type LoanView = {
  id: string;
  borrower: string;
  borrowDate: string;
  amount: number;
  interest: number;
  dueDate: string;
  penalty: number;
  paid: boolean;
  paidDate: string | null;
  transferImage: string | null;
  transferImage2: string | null;
  repaymentImage: string | null;
  outAccountName: string | null;
  outWalletName: string | null;
  inAccountName: string | null;
  inWalletName: string | null;
};

const STATUS_STYLE: Record<LoanStatus, { label: string; bg: string; color: string; accent: string }> = {
  active: { label: "ปกติ", bg: "#eee7f8", color: "#6a5a8a", accent: "#c9b0ea" },
  due: { label: "ใกล้กำหนด", bg: "#fdf3ea", color: "#a5771a", accent: "#d99a4a" },
  overdue: { label: "เกินกำหนด", bg: "#fbe9f0", color: "#b8446e", accent: "#d0658a" },
  paid: { label: "ชำระแล้ว", bg: "#e3f2ec", color: "#3a8a6f", accent: "#4fa98a" },
};

export function LoansClient({
  loans,
  accounts,
  walletLabels,
  canEdit,
}: {
  loans: LoanView[];
  accounts: { id: string; name: string }[];
  walletLabels: string[];
  canEdit: boolean;
}) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteLoan(id);
      showToast(res.error ?? "ลบสัญญาเงินกู้แล้ว");
    });
  };

  const calcs = useMemo(() => loans.map((l) => ({ l, c: loanCalc({ ...l, dueDate: new Date(l.dueDate) }) })), [loans]);
  const outstanding = calcs.filter((x) => !x.l.paid).reduce((a, b) => a + b.l.amount, 0);
  const totalInterest = calcs.filter((x) => !x.l.paid).reduce((a, b) => a + b.l.interest, 0);
  const overdueCount = calcs.filter((x) => x.c.status === "overdue").length;
  const totalFee = calcs.reduce((a, b) => a + b.c.fee, 0);

  const q = search.trim().toLowerCase();
  const filtered = calcs
    .filter((x) => !q || x.l.borrower.toLowerCase().includes(q))
    .sort((a, b) => Number(a.l.paid) - Number(b.l.paid) || new Date(a.l.dueDate).getTime() - new Date(b.l.dueDate).getTime());

  const today = new Date().toISOString().slice(0, 10);
  const inOneMonth = new Date();
  inOneMonth.setMonth(inOneMonth.getMonth() + 1);

  return (
    <div>
      <PageHeader title="ปล่อยเงินกู้" subtitle="จัดการสัญญาเงินกู้ ดอกเบี้ย และกำหนดคืน">
        <SearchBox value={search} onChange={setSearch} />
        {canEdit && <AddButton label="เพิ่มสัญญา" onClick={() => setModalOpen(true)} />}
        {canEdit && <ExportControls />}
      </PageHeader>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>เงินต้นคงค้าง</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(outstanding)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>ดอกเบี้ยรับคาดหวัง</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#4fa98a" }}>
            {fmtBaht(totalInterest)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>เกินกำหนด</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {overdueCount} สัญญา
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>ค่าปรับสะสม</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {fmtBaht(totalFee)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {filtered.map(({ l, c }) => {
          const st = STATUS_STYLE[c.status];
          return (
            <div key={l.id} style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "20px 22px", borderLeft: `5px solid ${st.accent}`, position: "relative" }}>
              {canEdit && (
                <button
                  onClick={() => handleDelete(l.id)}
                  title="ลบสัญญา"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    border: "none",
                    background: "#f5f0fc",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#d0658a",
                    fontSize: 12,
                    opacity: 0.75,
                  }}
                >
                  ✕
                </button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{l.borrower}</div>
                    <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ยืมเมื่อ {thDate(l.borrowDate)}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 11px", borderRadius: 20, background: st.bg, color: st.color, marginRight: 28 }}>{st.label}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "18px 0 14px" }}>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>เงินต้น</div>
                  <div className="num" style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                    {fmtBaht(l.amount)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ดอกเบี้ย</div>
                  <div className="num" style={{ fontSize: 17, fontWeight: 600, marginTop: 2, color: "#4fa98a" }}>
                    {fmtBaht(l.interest)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>กำหนดคืน</div>
                  <div className="num" style={{ fontSize: 13.5, fontWeight: 500, marginTop: 4 }}>
                    {thDate(l.dueDate)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ค่าปรับล่าช้า</div>
                  <div className="num" style={{ fontSize: 13.5, fontWeight: 500, marginTop: 4, color: c.fee > 0 ? "#d0658a" : "#9b8fb0" }}>
                    {c.fee > 0 ? `${fmtBaht(c.fee)} (${c.lateDays} วัน)` : `${fmtBaht(l.penalty)}/วัน`}
                  </div>
                </div>
              </div>

              {(l.outAccountName || l.inAccountName) && (
                <div style={{ fontSize: 11.5, color: "#9b8fb0", marginBottom: 12, lineHeight: 1.7 }}>
                  {l.outAccountName && (
                    <div>
                      🐾 โอนออกจาก: {l.outAccountName}
                      {l.outWalletName && ` · ${l.outWalletName}`}
                    </div>
                  )}
                  {l.inAccountName && (
                    <div>
                      🐾 รับเข้าบัญชี: {l.inAccountName}
                      {l.inWalletName && ` · ${l.inWalletName}`}
                      {l.paidDate && ` (${thDate(l.paidDate)})`}
                    </div>
                  )}
                </div>
              )}

              {(l.transferImage || l.transferImage2 || l.repaymentImage) && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {l.transferImage && (
                    <ProofThumb label="สลิปโอนเงิน 1" src={l.transferImage} onView={() => setViewImage(l.transferImage)} />
                  )}
                  {l.transferImage2 && (
                    <ProofThumb label="สลิปโอนเงิน 2" src={l.transferImage2} onView={() => setViewImage(l.transferImage2)} />
                  )}
                  {l.repaymentImage && (
                    <ProofThumb label="สลิปรับคืน" src={l.repaymentImage} onView={() => setViewImage(l.repaymentImage)} />
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 13, borderTop: "1px solid #f4eefb" }}>
                <div>
                  <span style={{ fontSize: 11.5, color: "#9b8fb0" }}>รวมที่ต้องคืน </span>
                  <span className="num" style={{ fontSize: 16, fontWeight: 700 }}>
                    {fmtBaht(c.total)}
                  </span>
                </div>
                {canEdit && !l.paid && (
                  <button
                    onClick={() => setPayingId(l.id)}
                    style={{ padding: "7px 14px", background: "#7c5cc4", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    บันทึกรับคืน
                  </button>
                )}
                {l.paid && <span style={{ fontSize: 12.5, color: "#4fa98a", fontWeight: 600 }}>✓ ชำระครบแล้ว</span>}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <FormModal
          title="เพิ่มสัญญาเงินกู้"
          submitLabel="บันทึก"
          successMessage="เพิ่มสัญญาเงินกู้เรียบร้อย"
          onClose={() => setModalOpen(false)}
          action={createLoan}
          fields={[
            { kind: "input", name: "borrower", label: "ชื่อผู้ยืม", placeholder: "เช่น คุณสมชาย" },
            { kind: "input", name: "borrowDate", label: "วันที่ยืม", type: "date", defaultValue: today },
            { kind: "input", name: "amount", label: "จำนวนเงินต้น (บาท)", type: "number", placeholder: "0" },
            { kind: "input", name: "interest", label: "ดอกเบี้ย (บาท)", type: "number", placeholder: "0" },
            { kind: "input", name: "dueDate", label: "กำหนดคืน", type: "date", defaultValue: inOneMonth.toISOString().slice(0, 10) },
            { kind: "input", name: "penalty", label: "ค่าปรับล่าช้า (บาท/วัน)", type: "number", placeholder: "0" },
            { kind: "select", name: "outAccountName", label: "โอนออกจากบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
            ...(walletLabels.length
              ? [{ kind: "select" as const, name: "outWalletLabel", label: "กระเป๋าย่อย (ถ้ามี)", options: ["— ไม่ระบุกระเป๋า —", ...walletLabels] }]
              : []),
            { kind: "image", name: "transferImage", label: "รูปหลักฐานการโอนเงิน 1 (ถ้ามี)" },
            { kind: "image", name: "transferImage2", label: "รูปหลักฐานการโอนเงิน 2 (ถ้ามี)" },
          ]}
        />
      )}

      {payingId && (
        <FormModal
          title="บันทึกรับคืนเงินกู้"
          submitLabel="บันทึกรับคืน"
          successMessage="บันทึกการรับคืนเงินกู้แล้ว"
          onClose={() => setPayingId(null)}
          action={payLoan.bind(null, payingId)}
          fields={[
            { kind: "input", name: "paidDate", label: "วันที่คืนเงิน", type: "date", defaultValue: today },
            { kind: "select", name: "inAccountName", label: "รับเงินเข้าบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
            ...(walletLabels.length
              ? [{ kind: "select" as const, name: "inWalletLabel", label: "กระเป๋าย่อย (ถ้ามี)", options: ["— ไม่ระบุกระเป๋า —", ...walletLabels] }]
              : []),
            { kind: "image", name: "repaymentImage", label: "รูปหลักฐานการรับคืน (ถ้ามี)" },
          ]}
        />
      )}

      {viewImage && (
        <div
          onClick={() => setViewImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(40,25,60,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            zIndex: 70,
            cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={viewImage} alt="" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }} />
        </div>
      )}
    </div>
  );
}

function ProofThumb({ label, src, onView }: { label: string; src: string; onView: () => void }) {
  return (
    <button
      onClick={onView}
      title={label}
      style={{ border: "1px solid #ece2f7", borderRadius: 10, padding: 3, background: "#faf6ff", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 7, display: "block" }} />
      <span style={{ fontSize: 9.5, color: "#9b8fb0" }}>{label}</span>
    </button>
  );
}
