import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { CatFace, CatHero } from "@/components/icons/Cat";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "stretch", animation: "fadeIn .4s ease" }}>
      <div
        className="login-hero"
        style={{
          flex: 1,
          display: "none",
          background: "linear-gradient(160deg,#8b6fd0,#b79ee6 70%,#e7b8d8)",
          color: "#fff",
          padding: "60px 56px",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.12)", top: -60, right: -40 }} />
        <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.10)", bottom: 80, left: -50 }} />

        <div className="mali" style={{ fontWeight: 600, letterSpacing: ".02em", fontSize: 16, display: "flex", alignItems: "center", gap: 11, position: "relative" }}>
          <span style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,.9)", display: "grid", placeItems: "center", padding: 4 }}>
            <CatFace mouthCurls />
          </span>
          กำไรและวิว
        </div>

        <div style={{ position: "relative", textAlign: "center" }}>
          <div className="cat-bob" style={{ width: 160, height: 160, margin: "0 auto 26px", filter: "drop-shadow(0 14px 24px rgba(80,50,120,.28))" }}>
            <CatHero />
          </div>
          <div className="mali" style={{ fontSize: 38, lineHeight: 1.2, fontWeight: 600, letterSpacing: "-.01em" }}>
            ระบบจัดการ
            <br />
            เงินกู้และบัญชี
          </div>
          <p style={{ margin: "18px auto 0", fontSize: 15, lineHeight: 1.7, color: "#fbf3fb", maxWidth: 340 }}>
            รวมบัญชีธนาคาร เงินสด รายรับ-รายจ่าย และการปล่อยเงินกู้ ไว้ในที่เดียว มีน้องวิเชียรมาศคอยดูแลให้ 🐾
          </p>
        </div>

        <div style={{ fontSize: 12.5, color: "#f3e6f5", position: "relative" }}>© 2569 กำไรและวิว · จัดการการเงินอย่างละมุน</div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 6 }}>
            <span style={{ width: 38, height: 38, borderRadius: 12, background: "#7c5cc4", display: "grid", placeItems: "center", padding: 5 }}>
              <CatFace />
            </span>
            <span className="mali" style={{ fontWeight: 600, fontSize: 18, color: "#40354f" }}>
              กำไรและวิว
            </span>
          </div>
          <h1 className="mali" style={{ fontSize: 25, fontWeight: 600, margin: "22px 0 4px", letterSpacing: "-.01em" }}>
            เข้าสู่ระบบ
          </h1>
          <p style={{ margin: "0 0 26px", color: "#9b8fb0", fontSize: 14 }}>กรอกชื่อผู้ใช้และรหัสผ่าน แล้วน้องแมวจะพาเข้าไปน้า</p>

          <LoginForm />

          <div style={{ marginTop: 26, padding: 16, background: "#f0e9fb", borderRadius: 14, fontSize: 12.5, color: "#7a6e90", lineHeight: 1.9 }}>
            <div className="mali" style={{ fontWeight: 600, color: "#40354f", marginBottom: 4 }}>
              🐱 บัญชีทดลอง
            </div>
            ผู้ดูแลระบบ — <b>admin</b> / <b>1234</b>
            <br />
            พนักงาน — <b>staff</b> / <b>1234</b>
          </div>
        </div>
      </div>
    </div>
  );
}
