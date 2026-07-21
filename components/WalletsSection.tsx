"use client";

import { useState, useTransition } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fmtBaht } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/constants";
import { FormModal } from "./FormModal";
import { useToast } from "./ToastProvider";
import { DogSitting } from "./icons/Dog";
import { IconEdit, IconTrash } from "./icons/Icons";
import { createWallet, updateWallet, deleteWallet, reorderWallets } from "@/app/actions/wallets";

type WalletView = { id: string; name: string; balance: number; openingBalance: number };

function SortableWalletCard({
  wallet: w,
  canEdit,
  onEdit,
  onDelete,
}: {
  wallet: WalletView;
  canEdit: boolean;
  onEdit: (w: WalletView) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: w.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "relative",
        background: "#faf6ff",
        border: "1px solid #ece2f7",
        borderRadius: 13,
        padding: "14px 16px",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 3 : undefined,
      }}
    >
      {canEdit && (
        <button
          {...attributes}
          {...listeners}
          title="ลากเพื่อสลับตำแหน่ง"
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            border: "none",
            background: "#f0e9fb",
            width: 20,
            height: 20,
            borderRadius: 6,
            cursor: "grab",
            color: "#7c5cc4",
            fontSize: 11,
            opacity: 0.75,
            touchAction: "none",
          }}
        >
          ⠿
        </button>
      )}
      {canEdit && (
        <button
          onClick={() => onEdit(w)}
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
            display: "grid",
            placeItems: "center",
            opacity: 0.75,
          }}
        >
          <IconEdit size={11} />
        </button>
      )}
      {canEdit && (
        <button
          onClick={() => onDelete(w.id)}
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
            display: "grid",
            placeItems: "center",
            opacity: 0.75,
          }}
        >
          <IconTrash size={11} />
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
  );
}

export function WalletsSection({ accountId, wallets, canEdit }: { accountId: string; wallets: WalletView[]; canEdit: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletView | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>(() => wallets.map((w) => w.id));
  const [, startTransition] = useTransition();
  const { showToast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const byId = new Map(wallets.map((w) => [w.id, w]));
  const effectiveIds = [...orderIds.filter((id) => byId.has(id)), ...wallets.filter((w) => !orderIds.includes(w.id)).map((w) => w.id)];
  const orderedWallets = effectiveIds.map((id) => byId.get(id)!);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteWallet(id, accountId);
      showToast(res.error ?? "ลบกระเป๋าแล้ว");
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
      const res = await reorderWallets(accountId, newOrder);
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
        <DndContext id={`wallets-dnd-${accountId}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={effectiveIds} strategy={rectSortingStrategy}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
              {orderedWallets.map((w) => (
                <SortableWalletCard key={w.id} wallet={w} canEdit={canEdit} onEdit={setEditingWallet} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
