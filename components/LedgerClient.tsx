"use client";

import { useMemo, useState, useTransition } from "react";
import { fmtBaht } from "@/lib/format";
import { defaultDateRange, inDateRange } from "@/lib/dateRange";
import { PageHeader, SearchBox, AddButton } from "./PageHeader";
import { ExportControls } from "./ExportControls";
import { DateRangeFilter } from "./DateRangeFilter";
import { FormModal, type ModalField } from "./FormModal";
import { useToast } from "./ToastProvider";
import { createTransaction, deleteTransaction, type TxKind } from "@/app/actions/transactions";
import { IconTrash } from "./icons/Icons";

export type LedgerRow = {
  id: string;
  dateText: string;
  date: string;
  note: string;
  category: string;
  accountId: string;
  accountName: string;
  amount: number;
};

export function LedgerClient({
  kind,
  rows,
  categories,
  accounts,
  walletsByAccount,
  canEdit,
}: {
  kind: TxKind;
  rows: LedgerRow[];
  categories: string[];
  accounts: { id: string; name: string }[];
  walletsByAccount: Record<string, string[]>;
  canEdit: boolean;
}) {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(defaultDateRange);
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();

  const word = kind === "income" ? "รายรับ" : "รายจ่าย";
  const color = kind === "income" ? "#10B981" : "#F43F5E";
  const title = kind === "income" ? "รายการรับ" : "รายการจ่าย";
  const subtitle = kind === "income" ? "บันทึกและติดตามรายรับทั้งหมด" : "บันทึกและติดตามรายจ่ายทั้งหมด";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (!inDateRange(r.date, range)) return false;
      if (!q) return true;
      return r.note.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.accountName.toLowerCase().includes(q);
    });
  }, [rows, search, range]);

  const total = filtered.reduce((a, b) => a + b.amount, 0);

  const handleDelete = (id: string, accountId: string) => {
    startTransition(async () => {
      const res = await deleteTransaction(id, accountId);
      showToast(res.error ?? "ลบรายการแล้ว");
    });
  };

  const hasWallets = Object.keys(walletsByAccount).length > 0;
  const fields: ModalField[] = [
    { kind: "input", name: "date", label: "วันที่", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
    { kind: "input", name: "note", label: "รายละเอียด", placeholder: "เช่น ดอกเบี้ยรับ, ค่าเช่า" },
    { kind: "select", name: "category", label: "หมวดหมู่", options: categories, defaultValue: categories[0] },
    { kind: "select", name: "accountName", label: "บัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
    ...(hasWallets
      ? [
          {
            kind: "dependentSelect" as const,
            name: "walletLabel",
            label: "กระเป๋าย่อย (ถ้ามี)",
            dependsOn: "accountName",
            optionsByParent: walletsByAccount,
            placeholder: "— ไม่ระบุกระเป๋า —",
          },
        ]
      : []),
    { kind: "input", name: "amount", label: "จำนวนเงิน (บาท)", type: "number", placeholder: "0" },
  ];

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle}>
        <DateRangeFilter value={range} onChange={setRange} />
        <SearchBox value={search} onChange={setSearch} />
        {canEdit && <AddButton label={kind === "income" ? "บันทึกรับ" : "บันทึกจ่าย"} onClick={() => setModalOpen(true)} />}
        {canEdit && (
          <ExportControls
            filename={`${kind === "income" ? "รายการรับ" : "รายการจ่าย"}.xlsx`}
            sheetName={kind === "income" ? "รายการรับ" : "รายการจ่าย"}
            rows={filtered.map((r) => ({
              วันที่: r.dateText,
              รายการ: r.note,
              หมวดหมู่: r.category,
              บัญชี: r.accountName,
              จำนวนเงิน: r.amount,
            }))}
          />
        )}
      </PageHeader>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>รวม{word}ทั้งหมด</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color }}>
            {fmtBaht(total)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>จำนวนรายการ</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {filtered.length} รายการ
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>เฉลี่ยต่อรายการ</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(filtered.length ? total / filtered.length : 0)}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, overflow: "hidden" }}>
        <div
          className="resp-table-head"
          style={{
            display: "grid",
            gridTemplateColumns: "110px 1.4fr 1fr 1fr 130px 44px",
            gap: 12,
            padding: "14px 22px",
            background: "#FAF5FF",
            borderBottom: "1px solid #F3E8FF",
            fontSize: 12,
            fontWeight: 600,
            color: "#8B7CA6",
          }}
        >
          <div>วันที่</div>
          <div>รายการ</div>
          <div>หมวดหมู่</div>
          <div>บัญชี</div>
          <div style={{ textAlign: "right" }}>จำนวนเงิน</div>
          <div />
        </div>
        {filtered
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((r) => (
            <div
              key={r.id}
              className="resp-table-row"
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1.4fr 1fr 1fr 130px 44px",
                gap: 12,
                padding: "14px 22px",
                borderBottom: "1px solid #F3E8FF",
                alignItems: "center",
                fontSize: 13.5,
              }}
            >
              <div data-label="วันที่" className="num" style={{ color: "#79668F" }}>
                {r.dateText}
              </div>
              <div data-label="รายการ" style={{ fontWeight: 500 }}>
                {r.note}
              </div>
              <div data-label="หมวดหมู่">
                <span style={{ fontSize: 12, padding: "3px 10px", background: "#F3E8FF", borderRadius: 20, color: "#79668F" }}>{r.category}</span>
              </div>
              <div data-label="บัญชี" style={{ color: "#79668F" }}>
                {r.accountName}
              </div>
              <div data-label="จำนวนเงิน" className="num resp-table-amount" style={{ textAlign: "right", fontWeight: 600, color }}>
                {fmtBaht(r.amount)}
              </div>
              <div className="resp-table-actions" style={{ textAlign: "right" }}>
                {canEdit && (
                  <button
                    onClick={() => handleDelete(r.id, r.accountId)}
                    title="ลบ"
                    style={{ display: "grid", placeItems: "center", border: "none", background: "none", color: "#F43F5E", cursor: "pointer", padding: 4, opacity: 0.6 }}
                  >
                    <IconTrash size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        {filtered.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 40, color: "#A996C4", fontSize: 13.5 }}>
            ไม่พบรายการ{word}
          </div>
        )}
      </div>

      {modalOpen && (
        <FormModal
          title={kind === "income" ? "บันทึกรายการรับ" : "บันทึกรายการจ่าย"}
          submitLabel="บันทึก"
          successMessage={kind === "income" ? "บันทึกรายการรับเรียบร้อย" : "บันทึกรายการจ่ายเรียบร้อย"}
          onClose={() => setModalOpen(false)}
          action={createTransaction.bind(null, kind)}
          fields={fields}
        />
      )}
    </div>
  );
}
