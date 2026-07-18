"use client";

import { useMemo, useState, useTransition } from "react";
import { fmtBaht, thDate } from "@/lib/format";
import { loanCalc, type LoanStatus } from "@/lib/loan";
import { PageHeader, SearchBox, AddButton } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { CatSitting, PawPrint } from "@/components/icons/Cat";
import { createLoan, updateLoan, payLoan, deleteLoan } from "@/app/actions/loans";

function walletLabel(accountName: string, walletName: string) {
  return `${accountName} · ${walletName}`;
}

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

const PAW_COLOR: Record<LoanStatus, string> = {
  active: "#9b7fd4",
  due: "#e8c34a",
  overdue: "#e2645a",
  paid: "#4fa98a",
};

function RepayQuote({ loan }: { loan: LoanView }) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [quoteDate, setQuoteDate] = useState(todayIso);
  const quote = loanCalc({ ...loan, dueDate: new Date(loan.dueDate) }, new Date(quoteDate));
  const total = loan.amount + loan.interest + quote.fee;

  return (
    <div style={{ background: "#faf6ff", border: "1px solid #ece2f7", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#7a6e90", fontWeight: 500 }}>🔍 เช็คยอดคืน ณ วันที่</span>
        <input
          type="date"
          value={quoteDate}
          onChange={(e) => setQuoteDate(e.target.value)}
          style={{ border: "1px solid #e0d3f0", borderRadius: 9, padding: "5px 8px", fontSize: 12.5, background: "#fff", outline: "none" }}
        />
      </div>
      <div className="num" style={{ fontSize: 19, fontWeight: 700, color: "#40354f" }}>
        {fmtBaht(total)}
      </div>
      <div style={{ fontSize: 11.5, color: "#9b8fb0", marginTop: 3 }}>
        เงินต้น {fmtBaht(loan.amount)} + ดอกเบี้ย {fmtBaht(loan.interest)}
        {quote.fee > 0 && ` + ค่าปรับล่าช้า ${fmtBaht(quote.fee)} (${quote.lateDays} วัน)`}
      </div>
    </div>
  );
}

export function LoansClient({
  loans,
  accounts,
  walletsByAccount,
  canEdit,
}: {
  loans: LoanView[];
  accounts: { id: string; name: string }[];
  walletsByAccount: Record<string, string[]>;
  canEdit: boolean;
}) {
  const hasWallets = Object.keys(walletsByAccount).length > 0;
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanView | null>(null);
  const [payingLoan, setPayingLoan] = useState<LoanView | null>(null);
  const [quoteOpenId, setQuoteOpenId] = useState<string | null>(null);
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
            <div
              key={l.id}
              style={{
                background: "#fff",
                border: "1px solid #ece2f7",
                borderRadius: 18,
                padding: "20px 22px",
                borderLeft: `5px solid ${st.accent}`,
                position: "relative",
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  right: l.paid ? -22 : -12,
                  bottom: l.paid ? -22 : -12,
                  width: l.paid ? 200 : 110,
                  height: l.paid ? 200 : 110,
                  opacity: l.paid ? 0.42 : 0.2,
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              >
                <PawPrint color={PAW_COLOR[c.status]} />
              </span>
              {canEdit && (
                <button
                  onClick={() => setEditingLoan(l)}
                  title="แก้ไขสัญญา"
                  style={{
                    position: "absolute",
                    right: 44,
                    top: 12,
                    border: "none",
                    background: "#f5f0fc",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#7c5cc4",
                    fontSize: 11,
                    opacity: 0.75,
                  }}
                >
                  ✎
                </button>
              )}
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
              {!l.paid && (
                <button
                  onClick={() => setQuoteOpenId(quoteOpenId === l.id ? null : l.id)}
                  title="เช็คยอดคืน"
                  style={{
                    position: "absolute",
                    right: canEdit ? 76 : 12,
                    top: 12,
                    border: "none",
                    background: quoteOpenId === l.id ? "#e7dcf7" : "#f5f0fc",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    cursor: "pointer",
                    color: "#7c5cc4",
                    fontSize: 13,
                    opacity: 0.75,
                    lineHeight: 1,
                  }}
                >
                  ⋯
                </button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span style={{ width: 36, height: 47, display: "block", flex: "0 0 36px" }}>
                    <CatSitting />
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{l.borrower}</div>
                    <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ยืมเมื่อ {thDate(l.borrowDate)}</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "4px 11px",
                    borderRadius: 20,
                    background: st.bg,
                    color: st.color,
                    marginRight: !canEdit ? 0 : l.paid ? 60 : 92,
                    whiteSpace: "nowrap",
                  }}
                >
                  {st.label}
                </span>
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

              {!l.paid && quoteOpenId === l.id && <RepayQuote loan={l} />}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 13, borderTop: "1px solid #f4eefb" }}>
                <div>
                  <span style={{ fontSize: 11.5, color: "#9b8fb0" }}>รวมที่ต้องคืน </span>
                  <span className="num" style={{ fontSize: 16, fontWeight: 700 }}>
                    {fmtBaht(c.total)}
                  </span>
                </div>
                {canEdit && !l.paid && (
                  <button
                    onClick={() => setPayingLoan(l)}
                    style={{ padding: "7px 14px", background: "#7c5cc4", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    บันทึกรับคืน
                  </button>
                )}
                {l.paid && (
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "#3a8a6f",
                      fontWeight: 600,
                      background: "#e3f2ec",
                      padding: "5px 12px",
                      borderRadius: 20,
                    }}
                  >
                    ✓ ชำระครบแล้ว
                  </span>
                )}
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
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "outWalletLabel",
                    label: "กระเป๋าย่อย (ถ้ามี)",
                    dependsOn: "outAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
              : []),
            { kind: "image", name: "transferImage", label: "รูปหลักฐานการโอนเงิน 1 (ถ้ามี)" },
            { kind: "image", name: "transferImage2", label: "รูปหลักฐานการโอนเงิน 2 (ถ้ามี)" },
          ]}
        />
      )}

      {editingLoan && (
        <FormModal
          title="แก้ไขสัญญาเงินกู้"
          submitLabel="บันทึก"
          successMessage="แก้ไขสัญญาเงินกู้เรียบร้อย"
          onClose={() => setEditingLoan(null)}
          action={updateLoan.bind(null, editingLoan.id)}
          fields={[
            { kind: "input", name: "borrower", label: "ชื่อผู้ยืม", placeholder: "เช่น คุณสมชาย", defaultValue: editingLoan.borrower },
            { kind: "input", name: "borrowDate", label: "วันที่ยืม", type: "date", defaultValue: editingLoan.borrowDate.slice(0, 10) },
            { kind: "input", name: "amount", label: "จำนวนเงินต้น (บาท)", type: "number", placeholder: "0", defaultValue: String(editingLoan.amount) },
            { kind: "input", name: "interest", label: "ดอกเบี้ย (บาท)", type: "number", placeholder: "0", defaultValue: String(editingLoan.interest) },
            { kind: "input", name: "dueDate", label: "กำหนดคืน", type: "date", defaultValue: editingLoan.dueDate.slice(0, 10) },
            { kind: "input", name: "penalty", label: "ค่าปรับล่าช้า (บาท/วัน)", type: "number", placeholder: "0", defaultValue: String(editingLoan.penalty) },
            {
              kind: "select",
              name: "outAccountName",
              label: "โอนออกจากบัญชี",
              options: accounts.map((a) => a.name),
              defaultValue: editingLoan.outAccountName ?? accounts[0]?.name,
            },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "outWalletLabel",
                    label: "กระเป๋าย่อย (ถ้ามี)",
                    dependsOn: "outAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                    defaultValue:
                      editingLoan.outWalletName && editingLoan.outAccountName
                        ? walletLabel(editingLoan.outAccountName, editingLoan.outWalletName)
                        : undefined,
                  },
                ]
              : []),
            { kind: "image", name: "transferImage", label: "รูปหลักฐานการโอนเงิน 1 (ถ้ามี)", defaultValue: editingLoan.transferImage ?? undefined },
            { kind: "image", name: "transferImage2", label: "รูปหลักฐานการโอนเงิน 2 (ถ้ามี)", defaultValue: editingLoan.transferImage2 ?? undefined },
          ]}
        />
      )}

      {payingLoan && (
        <FormModal
          title="บันทึกรับคืนเงินกู้"
          submitLabel="บันทึกรับคืน"
          successMessage="บันทึกการรับคืนเงินกู้แล้ว"
          onClose={() => setPayingLoan(null)}
          action={payLoan.bind(null, payingLoan.id)}
          fields={[
            { kind: "input", name: "paidDate", label: "วันที่คืนเงิน", type: "date", defaultValue: today },
            {
              kind: "preview",
              name: "totalPreview",
              render: (values) => {
                const paidDate = values.paidDate ? new Date(values.paidDate) : new Date();
                const calc = loanCalc({ ...payingLoan, dueDate: new Date(payingLoan.dueDate) }, paidDate);
                const total = payingLoan.amount + payingLoan.interest + calc.fee;
                return (
                  <div style={{ background: "#f5f0fc", borderRadius: 12, padding: "12px 14px", fontSize: 13 }}>
                    <div style={{ color: "#7a6e90", marginBottom: 4 }}>ถ้าคืนวันที่เลือก ต้องจ่ายรวม</div>
                    <div className="num" style={{ fontSize: 20, fontWeight: 700, color: "#40354f" }}>
                      {fmtBaht(total)}
                    </div>
                    <div style={{ color: "#9b8fb0", marginTop: 4 }}>
                      เงินต้น {fmtBaht(payingLoan.amount)} + ดอกเบี้ย {fmtBaht(payingLoan.interest)}
                      {calc.fee > 0 && ` + ค่าปรับล่าช้า ${fmtBaht(calc.fee)} (${calc.lateDays} วัน)`}
                    </div>
                  </div>
                );
              },
            },
            { kind: "select", name: "inAccountName", label: "รับเงินเข้าบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
            ...(hasWallets
              ? [
                  {
                    kind: "dependentSelect" as const,
                    name: "inWalletLabel",
                    label: "กระเป๋าย่อย (ถ้ามี)",
                    dependsOn: "inAccountName",
                    optionsByParent: walletsByAccount,
                    placeholder: "— ไม่ระบุกระเป๋า —",
                  },
                ]
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
