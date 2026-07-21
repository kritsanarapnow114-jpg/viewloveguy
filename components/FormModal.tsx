"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useCelebration } from "./CelebrationProvider";
import { compressImageFile } from "@/lib/image";
import { fmtBaht } from "@/lib/format";
import { IconClose, IconCamera } from "./icons/Icons";

export type ModalField =
  | { kind: "input"; name: string; label: string; type?: string; placeholder?: string; defaultValue?: string }
  | { kind: "select"; name: string; label: string; options: string[]; defaultValue?: string }
  | { kind: "image"; name: string; label: string; defaultValue?: string }
  | {
      kind: "dependentSelect";
      name: string;
      label: string;
      dependsOn: string;
      optionsByParent: Record<string, string[]>;
      placeholder: string;
      defaultValue?: string;
    }
  | { kind: "preview"; name: string; render: (values: Record<string, string>) => React.ReactNode }
  | {
      kind: "scheduleAmounts";
      name: string;
      label: string;
      monthsField: string;
      totalField?: string;
      defaultAmounts?: number[];
    };

type FormState = { error?: string; success?: boolean };

function fieldDefaultValue(f: ModalField): string {
  return ("defaultValue" in f && f.defaultValue) || "";
}

export function FormModal({
  title,
  fields,
  action,
  onClose,
  successMessage,
  submitLabel = "บันทึก",
  illustration,
}: {
  title: string;
  fields: ModalField[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  onClose: () => void;
  successMessage?: string;
  submitLabel?: string;
  illustration?: React.ReactNode;
}) {
  const { celebrate } = useCelebration();
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  const [initialValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of fields) {
      if (f.kind !== "preview") initial[f.name] = fieldDefaultValue(f);
    }
    return initial;
  });
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...initialValues }));

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; rect: DOMRect } | null>(null);

  useEffect(() => {
    if (state.success) {
      if (successMessage) celebrate(successMessage);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  useEffect(() => {
    const margin = 48;
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { startX, startY, origX, origY, rect } = dragRef.current;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      dx = Math.min(Math.max(dx, margin - rect.right), window.innerWidth - margin - rect.left);
      dy = Math.min(Math.max(dy, margin - rect.bottom), window.innerHeight - margin - rect.top);
      setPos({ x: origX + dx, y: origY + dy });
    };
    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, rect: e.currentTarget.getBoundingClientRect() };
    setDragging(true);
    document.body.style.userSelect = "none";
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(60,40,90,.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 50,
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "24px 30px 28px",
          width: "100%",
          maxWidth: 440,
          animation: dragging ? undefined : "popIn .28s ease",
          maxHeight: "92vh",
          overflow: "auto",
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <div
          onPointerDown={startDrag}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 18,
            position: "relative",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              display: "grid",
              placeItems: "center",
              border: "none",
              background: "#f5f0fc",
              width: 30,
              height: 30,
              borderRadius: 9,
              cursor: "pointer",
              color: "#7a6e90",
            }}
          >
            <IconClose size={14} />
          </button>
          {illustration && <div style={{ width: 84, height: 84, marginBottom: 6 }}>{illustration}</div>}
          <h3 className="mali" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>
            {title}
          </h3>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map((f) => {
            if (f.kind === "preview") {
              return <div key={f.name}>{f.render(values)}</div>;
            }
            return (
              <div key={f.name}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
                {f.kind === "image" ? (
                  <ImageField name={f.name} defaultValue={f.defaultValue} />
                ) : f.kind === "scheduleAmounts" ? (
                  <ScheduleAmountsField
                    name={f.name}
                    monthsCount={Math.max(0, Math.min(60, Math.round(Number(values[f.monthsField]) || 0)))}
                    totalAmount={f.totalField ? Number(values[f.totalField]) || 0 : 0}
                    defaultAmounts={f.defaultAmounts}
                  />
                ) : f.kind === "select" ? (
                  <select
                    name={f.name}
                    defaultValue={f.defaultValue}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #e0d3f0",
                      borderRadius: 11,
                      fontSize: 14,
                      background: "#fff",
                      outline: "none",
                    }}
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.kind === "dependentSelect" ? (
                  <select
                    key={values[f.dependsOn] ?? ""}
                    name={f.name}
                    defaultValue={values[f.dependsOn] === initialValues[f.dependsOn] ? f.defaultValue : ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #e0d3f0",
                      borderRadius: 11,
                      fontSize: 14,
                      background: "#fff",
                      outline: "none",
                    }}
                  >
                    <option value="">{f.placeholder}</option>
                    {(f.optionsByParent[values[f.dependsOn] ?? ""] || []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={f.name}
                    type={f.type || "text"}
                    defaultValue={f.defaultValue}
                    placeholder={f.placeholder}
                    step={f.type === "number" ? "any" : undefined}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid #e0d3f0",
                      borderRadius: 11,
                      fontSize: 14,
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            );
          })}

          {state.error && <div style={{ color: "#d0658a", fontSize: 12.5, marginTop: 12 }}>{state.error}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: 12,
                background: "#f5f0fc",
                border: "1px solid #ece2f7",
                borderRadius: 11,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                color: "#7a6e90",
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={pending}
              style={{
                flex: 1.4,
                padding: 12,
                background: "#7c5cc4",
                color: "#fff",
                border: "none",
                borderRadius: 11,
                fontSize: 14,
                fontWeight: 600,
                cursor: pending ? "default" : "pointer",
                opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? "กำลังบันทึก…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [dataUrl, setDataUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const compressed = await compressImageFile(file);
      setDataUrl(compressed);
    } catch {
      setError("บีบอัดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input type="hidden" name={name} value={dataUrl} />
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt=""
          style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginBottom: 8, display: "block" }}
        />
      )}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "10px 12px",
          border: "1px dashed #c9b0ea",
          borderRadius: 11,
          fontSize: 13.5,
          color: "#7c5cc4",
          cursor: "pointer",
          background: "#faf6ff",
        }}
      >
        {busy ? (
          "กำลังบีบอัดรูป…"
        ) : dataUrl ? (
          "เปลี่ยนรูป"
        ) : (
          <>
            <IconCamera size={15} />
            แนบรูปถ่ายหน้าจอโอนเงิน
          </>
        )}
        <input type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
      </label>
      {error && <div style={{ color: "#d0658a", fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function ScheduleAmountsField({
  name,
  monthsCount,
  totalAmount,
  defaultAmounts,
}: {
  name: string;
  monthsCount: number;
  totalAmount: number;
  defaultAmounts?: number[];
}) {
  const [valuesMap, setValuesMap] = useState<Record<number, string>>(() => {
    const m: Record<number, string> = {};
    (defaultAmounts ?? []).forEach((n, i) => {
      m[i] = String(n);
    });
    return m;
  });

  const amounts = Array.from({ length: monthsCount }, (_, i) => valuesMap[i] ?? "");
  const total = amounts.reduce((a, b) => a + (Number(b) || 0), 0);

  const fillEqually = () => {
    if (!totalAmount || monthsCount <= 0) return;
    const monthly = Math.round((totalAmount / monthsCount) * 100) / 100;
    const next: Record<number, string> = {};
    for (let i = 0; i < monthsCount; i++) next[i] = String(monthly);
    next[monthsCount - 1] = String(Math.round((totalAmount - monthly * (monthsCount - 1)) * 100) / 100);
    setValuesMap(next);
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(amounts.map((a) => Number(a) || 0))} />
      {totalAmount > 0 && monthsCount > 0 && (
        <button
          type="button"
          onClick={fillEqually}
          style={{
            fontSize: 12,
            color: "#7c5cc4",
            background: "#f5f0fc",
            border: "1px solid #e0d3f0",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          แบ่งเท่ากันอัตโนมัติจากยอดรวม
        </button>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto", paddingRight: 2 }}>
        {amounts.map((a, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 62, fontSize: 12, color: "#7a6e90", flexShrink: 0 }}>งวดที่ {idx + 1}</span>
            <input
              type="number"
              step="any"
              value={a}
              placeholder="0"
              onChange={(e) => {
                const v = e.target.value;
                setValuesMap((prev) => ({ ...prev, [idx]: v }));
              }}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid #e0d3f0",
                borderRadius: 9,
                fontSize: 13.5,
                outline: "none",
              }}
            />
          </div>
        ))}
        {amounts.length === 0 && <div style={{ fontSize: 12.5, color: "#b8a9d0" }}>กรอกจำนวนงวดก่อนเพื่อกำหนดยอดแต่ละงวด</div>}
      </div>
      <div style={{ fontSize: 12.5, color: "#7a6e90", marginTop: 8, textAlign: "right" }}>
        รวมทั้งหมด: <span className="num" style={{ fontWeight: 600, color: "#40354f" }}>{fmtBaht(total)}</span>
      </div>
    </div>
  );
}
