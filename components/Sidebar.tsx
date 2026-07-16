"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS: { key: string; href: string; label: string; badge: string }[] = [
  { key: "dashboard", href: "/dashboard", label: "ภาพรวม", badge: "📊" },
  { key: "accounts", href: "/accounts", label: "บัญชี & เงินสด", badge: "💰" },
  { key: "income", href: "/income", label: "รายการรับ", badge: "⬆️" },
  { key: "expense", href: "/expense", label: "รายการจ่าย", badge: "⬇️" },
  { key: "loans", href: "/loans", label: "ปล่อยเงินกู้", badge: "🤝" },
  { key: "pnl", href: "/pnl", label: "กำไร - ขาดทุน", badge: "📈" },
];

export function Sidebar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-label="เปิดเมนู"
        onClick={() => setOpen(true)}
        style={{
          display: "none",
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 75,
          width: 40,
          height: 40,
          borderRadius: 11,
          border: "1px solid #ece2f7",
          background: "#fff",
          color: "#5a5068",
          fontSize: 18,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(80,50,120,.14)",
        }}
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="side-backdrop"
          style={{ position: "fixed", inset: 0, background: "rgba(40,25,60,.35)", zIndex: 70 }}
        />
      )}

      <aside
        className={"app-side" + (open ? " open" : "")}
        style={{
          width: 246,
          flex: "0 0 246px",
          background: "#fff",
          borderRight: "1px solid #ece2f7",
          padding: "22px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div className="side-brand" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 20px" }}>
          <span className="mali" style={{ fontWeight: 600, fontSize: 16 }}>
            กำไรและวิว
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = item.key === "accounts" ? pathname.startsWith("/accounts") : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="nav-item"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14.5,
                fontWeight: active ? 600 : 500,
                background: active ? "#7c5cc4" : "transparent",
                color: active ? "#fff" : "#5a5068",
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center", flex: "0 0 20px" }}>{item.badge}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="side-foot" style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid #f0e9f8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
              <div style={{ fontSize: 11.5, color: "#9b8fb0" }}>{userRole}</div>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: 8,
                padding: 9,
                background: "#f5f0fc",
                border: "1px solid #ece2f7",
                borderRadius: 11,
                fontSize: 13,
                color: "#7a6e90",
                cursor: "pointer",
              }}
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
