"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 7 }}>ชื่อผู้ใช้</label>
      <input
        name="username"
        placeholder="เช่น admin"
        autoComplete="username"
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #e0d3f0",
          borderRadius: 12,
          fontSize: 14.5,
          background: "#fff",
          outline: "none",
          marginBottom: 16,
        }}
      />

      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 7 }}>รหัสผ่าน</label>
      <input
        name="password"
        type="password"
        placeholder="••••"
        autoComplete="current-password"
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #e0d3f0",
          borderRadius: 12,
          fontSize: 14.5,
          background: "#fff",
          outline: "none",
          marginBottom: 8,
        }}
      />

      {state.error && <div style={{ color: "#d0658a", fontSize: 13, margin: "4px 0 8px" }}>{state.error}</div>}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 13,
          background: "#7c5cc4",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: pending ? "default" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
