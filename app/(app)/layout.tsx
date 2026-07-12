import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/ToastProvider";
import { CelebrationProvider } from "@/components/CelebrationProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <ToastProvider>
      <CelebrationProvider>
        <div className="app-shell" style={{ display: "flex", minHeight: "100vh", animation: "fadeIn .35s ease" }}>
          <Sidebar userName={user.name} userRole={user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "พนักงานบัญชี"} />
          <main className="app-main" style={{ flex: 1, minWidth: 0, padding: "30px 34px 60px" }}>
            {children}
          </main>
        </div>
      </CelebrationProvider>
    </ToastProvider>
  );
}
