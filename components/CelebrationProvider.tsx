"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type CelebrationContextValue = { celebrate: (msg: string) => void };
const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const celebrate = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 1300);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {visible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 80,
            pointerEvents: "none",
            background: "rgba(60,40,90,.16)",
            animation: "fadeIn .2s ease",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "26px 34px 22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 20px 60px rgba(80,50,120,.28)",
              animation: "popIn .32s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <div className="mali" style={{ fontSize: 15.5, fontWeight: 600, color: "#3B2A5C", textAlign: "center", maxWidth: 220 }}>
              {message}
            </div>
          </div>
        </div>
      )}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be used inside CelebrationProvider");
  return ctx;
}
