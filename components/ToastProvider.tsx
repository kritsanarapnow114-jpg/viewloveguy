"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastContextValue = { showToast: (msg: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          style={{
            position: "fixed",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3B2A5C",
            color: "#fff",
            padding: "12px 20px 12px 14px",
            borderRadius: 14,
            fontSize: 13.5,
            fontWeight: 500,
            boxShadow: "0 8px 30px rgba(80,50,120,.28)",
            zIndex: 60,
            animation: "toastIn .3s ease",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
