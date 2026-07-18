"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fmtBaht } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { PageHeader, AddButton } from "@/components/PageHeader";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ToastProvider";
import { CatSitting } from "@/components/icons/Cat";
import { createAccount, updateAccount, deleteAccount, reorderAccounts } from "@/app/actions/accounts";
import { transferFunds } from "@/app/actions/transfers";

type AccountView = {
  id: string;
  name: string;
  type: "BANK" | "CASH";
  number: string;
  balance: number;
  openingBalance: number;
};

function SortableAccountCard({
  account: a,
  canEdit,
  onEdit,
  onDelete,
}: {
  account: AccountView;
  canEdit: boolean;
  onEdit: (a: AccountView) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: a.id });
  const low = a.balance < LOW_BALANCE_THRESHOLD;

  return (
    <Link
      ref={setNodeRef}
      href={`/accounts/${a.id}`}
      style={{
        background: "#fffdfa",
        border: "1px solid #f3e9db",
        borderRadius: 16,
        padding: 15,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        display: "block",
        color: "inherit",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 3 : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -22,
          bottom: -22,
          width: 108,
          height: 96,
          borderRadius: "48% 52% 40% 60% / 60% 45% 55% 40%",
          background: "linear-gradient(135deg,#ffe6c9,#ffd8b0)",
          opacity: 0.65,
        }}
      />
      {canEdit && (
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.preventDefault()}
          title="ลากเพื่อสลับตำแหน่ง"
          style={{
            position: "absolute",
            left: 9,
            top: 9,
            zIndex: 2,
            border: "none",
            background: "#f5f0fc",
            width: 22,
            height: 22,
            borderRadius: 7,
            cursor: "grab",
            color: "#7c5cc4",
            fontSize: 12,
            opacity: 0.75,
            touchAction: "none",
          }}
        >
          ⠿
        </button>
      )}
      {canEdit && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(a);
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
            onDelete(a.id);
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
      <div style={{ position: "relative", marginTop: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 32, height: 42, display: "block" }}>
            <CatSitting />
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
}

export function AccountsClient({
  accounts,
  walletsByAccount,
  outstandingLoans,
  outstandingLoanCount,
  canEdit,
}: {
  accounts: AccountView[];
  walletsByAccount: Record<string, string[]>;
  outstandingLoans: number;
  outstandingLoanCount: number;
  canEdit: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountView | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>(() => accounts.map((a) => a.id));
  const hasWallets = Object.keys(walletsByAccount).length > 0;
  const [, startTransition] = useTransition();
  const { showToast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const byId = new Map(accounts.map((a) => [a.id, a]));
  const effectiveIds = [...orderIds.filter((id) => byId.has(id)), ...accounts.filter((a) => !orderIds.includes(a.id)).map((a) => a.id)];
  const orderedAccounts = effectiveIds.map((id) => byId.get(id)!);

  const totalBalance = accounts.reduce((a, b) => a + b.balance, 0);
  const bankTotal = accounts.filter((a) => a.type === "BANK").reduce((a, b) => a + b.balance, 0);
  const cashTotal = accounts.filter((a) => a.type === "CASH").reduce((a, b) => a + b.balance, 0);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteAccount(id);
      showToast(res.error ?? "ลบบัญชีแล้ว");
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = effectiveIds.indexOf(String(active.id));
    const newIndex = effectiveIds.indexOf(String(over.id));
    const newOrder = arrayMove(effectiveIds, oldIndex, newIndex);
    setOrderIds(newOrder);
    startTransition(async () => {
      const res = await reorderAccounts(newOrder);
      if (res.error) showToast(res.error);
    });
  };

  return (
    <div>
      <PageHeader title="บัญชี & เงินสด" subtitle="จัดการบัญชีธนาคารและเงินสด — คลิกที่การ์ดเพื่อดูรายการ">
        {canEdit && (
          <button
            onClick={() => setTransferOpen(true)}
            style={{
              padding: "10px 16px",
              background: "#fff",
              color: "#7c5cc4",
              border: "1px solid #e0d3f0",
              borderRadius: 11,
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ⇄ โอนเงิน
          </button>
        )}
        {canEdit && <AddButton label="เพิ่มบัญชี" onClick={() => setModalOpen(true)} />}
      </PageHeader>

      <DndContext id="accounts-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={effectiveIds} strategy={rectSortingStrategy}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 18 }}>
            {orderedAccounts.map((a) => (
              <SortableAccountCard key={a.id} account={a} canEdit={canEdit} onEdit={setEditingAccount} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
          <br />
          เงินกู้คงค้าง{" "}
          <span className="num" style={{ color: "#fff" }}>
            {fmtBaht(outstandingLoans)}
          </span>
          {outstandingLoanCount > 0 && ` (${outstandingLoanCount} สัญญา)`}
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

      {transferOpen && (
        <FormModal
          title="โอนย้ายเงิน"
          submitLabel="โอนเงิน"
          successMessage="โอนเงินเรียบร้อย"
          onClose={() => setTransferOpen(false)}
          action={transferFunds}
          fields={[
            { kind: "input", name: "date", label: "วันที่โอน", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
            { kind: "select", name: "fromAccountName", label: "จากบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[0]?.name },
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
            { kind: "select", name: "toAccountName", label: "ไปบัญชี", options: accounts.map((a) => a.name), defaultValue: accounts[1]?.name ?? accounts[0]?.name },
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
    </div>
  );
}
