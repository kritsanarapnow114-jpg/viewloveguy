"use client";

import { useMemo, useState, useTransition } from "react";
import { fmtBaht, thDate } from "@/lib/format";
import { installmentCalc, type InstallmentStatus } from "@/lib/installment";
import { defaultDateRange, inDateRange } from "@/lib/dateRange";
import { PageHeader, SearchBox, AddButton } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { CatSitting } from "@/components/icons/Cat";
import { createInstallment, updateInstallment, payInstallment, deleteInstallment } from "@/app/actions/installments";

type InstallmentView = {
  id: string;
  item: string;
  totalAmount: number;
  months: number;
  amounts: number[];
  startDate: string;
  paidMonths: number;
};

const STATUS_STYLE: Record<InstallmentStatus, { label: string; bg: string; color: string; accent: string }> = {
  active: { label: "ปกติ", bg: "#eee7f8", color: "#6a5a8a", accent: "#c9b0ea" },
  due: { label: "ถึงกำหนดงวดนี้", bg: "#fdf3ea", color: "#a5771a", accent: "#d99a4a" },
  completed: { label: "ผ่อนครบแล้ว", bg: "#e3f2ec", color: "#3a8a6f", accent: "#4fa98a" },
};

export function InstallmentsClient({
  installments,
  accounts,
  walletsByAccount,
  canEdit,
}: {
  installments: InstallmentView[];
  accounts: { id: string; name: string }[];
  walletsByAccount: Record<string, string[]>;
  canEdit: boolean;
}) {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(defaultDateRange);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentView | null>(null);
  const [payingInstallment, setPayingInstallment] = useState<InstallmentView | null>(null);
  const [, startTransition] = useTransition();
  const { showToast } = useToast();
  const hasWallets = Object.keys(walletsByAccount).length > 0;

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteInstallment(id);
      showToast(res.error ?? "ลบรายการผ่อนชำระแล้ว");
    });
  };

  const calcs = useMemo(
    () => installments.map((i) => ({ i, c: installmentCalc({ ...i, startDate: new Date(i.startDate) }) })),
    [installments]
  );
  const remainingTotal = calcs.reduce((a, b) => a + b.c.remainingAmount, 0);
  const monthlyTotal = calcs.filter((x) => x.c.status !== "completed").reduce((a, b) => a + b.c.nextPaymentAmount, 0);
  const dueCount = calcs.filter((x) => x.c.status === "due").length;
  const activeCount = calcs.filter((x) => x.c.status !== "completed").length;

  const q = search.trim().toLowerCase();
  const filtered = calcs
    .filter((x) => inDateRange(x.i.startDate, range) && (!q || x.i.item.toLowerCase().includes(q)))
    .sort((a, b) => Number(a.c.status === "completed") - Number(b.c.status === "completed") || a.c.nextDueDate.getTime() - b.c.nextDueDate.getTime());

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader title="ผ่อนชำระสินค้า" subtitle="ติดตามรายการผ่อนสินค้ารายเดือน เช่น ผ่อนช้อปปี้ 12 เดือน">
        <DateRangeFilter value={range} onChange={setRange} />
        <SearchBox value={search} onChange={setSearch} />
        {canEdit && <AddButton label="เพิ่มรายการผ่อน" onClick={() => setModalOpen(true)} />}
        {canEdit && (
          <ExportControls
            filename="ผ่อนชำระสินค้า.xlsx"
            sheetName="ผ่อนชำระสินค้า"
            rows={filtered.map(({ i, c }) => ({
              รายการ: i.item,
              เริ่มผ่อน: thDate(i.startDate),
              ยอดรวมทั้งหมด: i.totalAmount,
              จำนวนงวด: i.months,
              ผ่อนแล้ว: i.paidMonths,
              สถานะ: STATUS_STYLE[c.status].label,
              คงเหลือ: c.remainingAmount,
            }))}
          />
        )}
      </PageHeader>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>ยอดคงเหลือที่ต้องผ่อน</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(remainingTotal)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>ยอดผ่อนต่อเดือนรวม</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {fmtBaht(monthlyTotal)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>ถึงกำหนดงวดนี้</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {dueCount} รายการ
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>กำลังผ่อนอยู่</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {activeCount} รายการ
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {filtered.map(({ i, c }) => {
          const st = STATUS_STYLE[c.status];
          const progressPct = Math.round((i.paidMonths / i.months) * 100);
          return (
            <div key={i.id} style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, padding: "20px 22px", borderLeft: `5px solid ${st.accent}`, position: "relative" }}>
              {canEdit && (
                <button
                  onClick={() => setEditingInstallment(i)}
                  title="แก้ไขรายการ"
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
                  onClick={() => handleDelete(i.id)}
                  title="ลบรายการ"
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
                  <span style={{ width: 36, height: 47, display: "block", flex: "0 0 36px" }}>
                    <CatSitting />
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{i.item}</div>
                    <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>เริ่มผ่อน {thDate(i.startDate)}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 11px", borderRadius: 20, background: st.bg, color: st.color, marginRight: 60 }}>{st.label}</span>
              </div>

              <div style={{ margin: "16px 0 4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#9b8fb0", marginBottom: 5 }}>
                  <span>
                    ผ่อนแล้ว {i.paidMonths}/{i.months} งวด
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div style={{ height: 8, background: "#f4eefb", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: st.accent, borderRadius: 6 }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 14px" }}>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ยอดรวมทั้งหมด</div>
                  <div className="num" style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                    {fmtBaht(i.totalAmount)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>เฉลี่ย/เดือน</div>
                  <div className="num" style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                    {fmtBaht(i.totalAmount / i.months)}
                  </div>
                </div>
                {c.status !== "completed" && (
                  <div>
                    <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>งวดถัดไปกำหนด</div>
                    <div className="num" style={{ fontSize: 13.5, fontWeight: 500, marginTop: 4 }}>
                      {thDate(c.nextDueDate)}
                    </div>
                  </div>
                )}
                {c.status !== "completed" && (
                  <div>
                    <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>ยอดงวดถัดไป (งวดที่ {i.paidMonths + 1}/{i.months})</div>
                    <div
                      className="num"
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        marginTop: 4,
                        color: Math.abs(c.nextPaymentAmount - i.totalAmount / i.months) > 0.005 ? "#d0658a" : undefined,
                      }}
                    >
                      {fmtBaht(c.nextPaymentAmount)}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 13, borderTop: "1px solid #f4eefb" }}>
                <div>
                  <span style={{ fontSize: 11.5, color: "#9b8fb0" }}>คงเหลือ </span>
                  <span className="num" style={{ fontSize: 16, fontWeight: 700 }}>
                    {fmtBaht(c.remainingAmount)}
                  </span>
                </div>
                {canEdit && c.status !== "completed" && (
                  <button
                    onClick={() => setPayingInstallment(i)}
                    style={{ padding: "7px 14px", background: "#7c5cc4", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    จ่ายงวดนี้
                  </button>
                )}
                {c.status === "completed" && <span style={{ fontSize: 12.5, color: "#4fa98a", fontWeight: 600 }}>✓ ผ่อนครบแล้ว</span>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#b8a9d0", fontSize: 13.5 }}>ยังไม่มีรายการผ่อนชำระ</div>
        )}
      </div>

      {modalOpen && (
        <FormModal
          title="เพิ่มรายการผ่อนชำระ"
          submitLabel="บันทึก"
          successMessage="เพิ่มรายการผ่อนชำระเรียบร้อย"
          onClose={() => setModalOpen(false)}
          action={createInstallment}
          fields={[
            { kind: "input", name: "item", label: "ชื่อสินค้า/รายการ", placeholder: "เช่น ผ่อนช้อปปี้ - โน้ตบุ๊ก" },
            { kind: "input", name: "months", label: "จำนวนงวด (เดือน)", type: "number", placeholder: "12" },
            { kind: "input", name: "totalAmount", label: "ยอดรวมทั้งหมด (บาท) — ใช้แบ่งเท่ากันอัตโนมัติ", type: "number", placeholder: "0" },
            { kind: "input", name: "startDate", label: "วันที่เริ่มผ่อนงวดแรก", type: "date", defaultValue: today },
            {
              kind: "scheduleAmounts",
              name: "amounts",
              label: "ยอดผ่อนแต่ละงวด (บาท) — แก้ทีละงวดได้ เพราะบางแพลตฟอร์มจ่ายไม่เท่ากันทุกงวด",
              monthsField: "months",
              totalField: "totalAmount",
            },
          ]}
        />
      )}

      {editingInstallment && (
        <FormModal
          title="แก้ไขรายการผ่อนชำระ"
          submitLabel="บันทึก"
          successMessage="แก้ไขรายการเรียบร้อย"
          onClose={() => setEditingInstallment(null)}
          action={updateInstallment.bind(null, editingInstallment.id)}
          fields={[
            { kind: "input", name: "item", label: "ชื่อสินค้า/รายการ", placeholder: "เช่น ผ่อนช้อปปี้ - โน้ตบุ๊ก", defaultValue: editingInstallment.item },
            { kind: "input", name: "months", label: "จำนวนงวด (เดือน)", type: "number", placeholder: "12", defaultValue: String(editingInstallment.months) },
            { kind: "input", name: "totalAmount", label: "ยอดรวมทั้งหมด (บาท) — ใช้แบ่งเท่ากันอัตโนมัติ", type: "number", placeholder: "0", defaultValue: String(editingInstallment.totalAmount) },
            { kind: "input", name: "startDate", label: "วันที่เริ่มผ่อนงวดแรก", type: "date", defaultValue: editingInstallment.startDate.slice(0, 10) },
            {
              kind: "scheduleAmounts",
              name: "amounts",
              label: "ยอดผ่อนแต่ละงวด (บาท) — แก้ทีละงวดได้ เพราะบางแพลตฟอร์มจ่ายไม่เท่ากันทุกงวด",
              monthsField: "months",
              totalField: "totalAmount",
              defaultAmounts: editingInstallment.amounts,
            },
          ]}
        />
      )}

      {payingInstallment && (
        <FormModal
          title="บันทึกจ่ายงวดนี้"
          submitLabel="บันทึกจ่าย"
          successMessage="บันทึกการจ่ายงวดแล้ว"
          onClose={() => setPayingInstallment(null)}
          action={payInstallment.bind(null, payingInstallment.id)}
          fields={[
            {
              kind: "preview",
              name: "amountPreview",
              render: () => {
                const nextMonthNo = payingInstallment.paidMonths + 1;
                const payAmount = payingInstallment.amounts[payingInstallment.paidMonths];
                const isLast = nextMonthNo >= payingInstallment.months;
                return (
                  <div style={{ background: "#f5f0fc", borderRadius: 12, padding: "12px 14px", fontSize: 13 }}>
                    <div style={{ color: "#7a6e90", marginBottom: 4 }}>
                      ยอดที่ต้องจ่ายงวดที่ {nextMonthNo}/{payingInstallment.months}
                    </div>
                    <div className="num" style={{ fontSize: 20, fontWeight: 700, color: "#40354f" }}>
                      {fmtBaht(payAmount)}
                    </div>
                    {isLast && <div style={{ color: "#d0658a", marginTop: 4 }}>งวดสุดท้าย</div>}
                  </div>
                );
              },
            },
            { kind: "input", name: "paidDate", label: "วันที่จ่าย", type: "date", defaultValue: today },
            { kind: "select", name: "accountName", label: "จ่ายจากบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
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
          ]}
        />
      )}
    </div>
  );
}
