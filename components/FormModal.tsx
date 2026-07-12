"use client";

import { useActionState, useEffect, useState } from "react";
import { useCelebration } from "./CelebrationProvider";
import { compressImageFile } from "@/lib/image";

export type ModalField =
  | { kind: "input"; name: string; label: string; type?: string; placeholder?: string; defaultValue?: string }
  | { kind: "select"; name: string; label: string; options: string[]; defaultValue?: string }
  | { kind: "image"; name: string; label: string; defaultValue?: string };

type FormState = { error?: string; success?: boolean };

export function FormModal({
  title,
  fields,
  action,
  onClose,
  successMessage,
  submitLabel = "บันทึก",
}: {
  title: string;
  fields: ModalField[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  onClose: () => void;
  successMessage?: string;
  submitLabel?: string;
}) {
  const { celebrate } = useCelebration();
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  useEffect(() => {
    if (state.success) {
      if (successMessage) celebrate(successMessage);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

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
          animation: "popIn .28s ease",
          maxHeight: "92vh",
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18, position: "relative" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              border: "none",
              background: "#f5f0fc",
              width: 30,
              height: 30,
              borderRadius: 9,
              cursor: "pointer",
              fontSize: 15,
              color: "#7a6e90",
            }}
          >
            ✕
          </button>
          <h3 className="mali" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>
            {title}
          </h3>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map((f) => (
            <div key={f.name}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
              {f.kind === "image" ? (
                <ImageField name={f.name} defaultValue={f.defaultValue} />
              ) : f.kind === "select" ? (
                <select
                  name={f.name}
                  defaultValue={f.defaultValue}
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
              ) : (
                <input
                  name={f.name}
                  type={f.type || "text"}
                  defaultValue={f.defaultValue}
                  placeholder={f.placeholder}
                  step={f.type === "number" ? "any" : undefined}
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
          ))}

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
        {busy ? "กำลังบีบอัดรูป…" : dataUrl ? "เปลี่ยนรูป" : "📷 แนบรูปถ่ายหน้าจอโอนเงิน"}
        <input type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
      </label>
      {error && <div style={{ color: "#d0658a", fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  );
}
