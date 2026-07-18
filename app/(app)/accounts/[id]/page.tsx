import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccountWithBalance, getAccountsWithBalance } from "@/lib/accounts";
import { getWalletsWithBalance, getWalletsByAccount } from "@/lib/wallets";
import { getCurrentUser } from "@/lib/session";
import { fmtBaht, thDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { ExportControls } from "@/components/ExportControls";
import { WalletsSection } from "@/components/WalletsSection";
import { TransferButton } from "@/components/TransferButton";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [account, wallets, allAccounts, walletsByAccount, user] = await Promise.all([
    getAccountWithBalance(id),
    getWalletsWithBalance(id),
    getAccountsWithBalance(),
    getWalletsByAccount(),
    getCurrentUser(),
  ]);
  if (!account) notFound();

  const rows = [...account.transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((r) => ({
      id: r.id,
      dateText: thDate(r.date),
      note: r.note,
      category: r.category,
      walletName: r.wallet?.name ?? null,
      isIncome: r.kind === "INCOME",
      amount: r.amount,
    }));
  const incSum = account.transactions.filter((t) => t.kind === "INCOME").reduce((a, b) => a + b.amount, 0);
  const expSum = account.transactions.filter((t) => t.kind === "EXPENSE").reduce((a, b) => a + b.amount, 0);
  const canEdit = user?.role === "ADMIN";

  return (
    <div>
      <PageHeader title={account.name} subtitle="รายการรับ-จ่ายทั้งหมดของบัญชีนี้">
        {canEdit && <TransferButton accountNames={allAccounts.map((a) => a.name)} walletsByAccount={walletsByAccount} defaultFromAccountName={account.name} />}
        {canEdit && (
          <ExportControls
            filename={`${account.name}.xlsx`}
            sheetName="รายการ"
            rows={rows.map((r) => ({
              วันที่: r.dateText,
              ประเภท: r.isIncome ? "รับ" : "จ่าย",
              รายการ: r.note,
              หมวดหมู่: r.category,
              กระเป๋า: r.walletName ?? "",
              จำนวนเงิน: r.amount,
            }))}
          />
        )}
      </PageHeader>

      <Link href="/accounts" style={{ display: "inline-block", border: "none", background: "none", color: "#7a6e90", fontSize: 13.5, padding: 0, marginBottom: 16 }}>
        ← กลับไปหน้าบัญชี
      </Link>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 170, background: "linear-gradient(135deg,#7c5cc4,#a98fd8)", color: "#fff", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#eee3fb" }}>ยอดคงเหลือปัจจุบัน</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(account.balance)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 170, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>รับเข้าบัญชีนี้</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#4fa98a" }}>
            {"+" + fmtBaht(incSum).slice(1)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 170, background: "#fff", border: "1px solid #ece2f7", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#9b8fb0" }}>จ่ายจากบัญชีนี้</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#d0658a" }}>
            {"−" + fmtBaht(expSum).slice(1)}
          </div>
        </div>
      </div>

      <WalletsSection
        accountId={id}
        wallets={wallets.map((w) => ({ id: w.id, name: w.name, balance: w.balance, openingBalance: w.openingBalance }))}
        canEdit={canEdit}
      />

      <div style={{ background: "#fff", border: "1px solid #ece2f7", borderRadius: 18, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "110px 90px 1.2fr 1fr 1fr 140px",
            gap: 12,
            padding: "14px 22px",
            background: "#faf6ff",
            borderBottom: "1px solid #f0e9f8",
            fontSize: 12,
            fontWeight: 600,
            color: "#9b8fb0",
          }}
        >
          <div>วันที่</div>
          <div>ประเภท</div>
          <div>รายการ</div>
          <div>หมวดหมู่</div>
          <div>กระเป๋า</div>
          <div style={{ textAlign: "right" }}>จำนวนเงิน</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "110px 90px 1.2fr 1fr 1fr 140px",
              gap: 12,
              padding: "14px 22px",
              borderBottom: "1px solid #f4eefb",
              alignItems: "center",
              fontSize: 13.5,
            }}
          >
            <div className="num" style={{ color: "#7a6e90" }}>
              {r.dateText}
            </div>
            <div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: r.isIncome ? "#e3f2ec" : "#fbe9f0",
                  color: r.isIncome ? "#4fa98a" : "#d0658a",
                }}
              >
                {r.isIncome ? "รับ" : "จ่าย"}
              </span>
            </div>
            <div style={{ fontWeight: 500 }}>{r.note}</div>
            <div style={{ color: "#7a6e90", fontSize: 12.5 }}>{r.category}</div>
            <div style={{ color: "#7a6e90", fontSize: 12.5 }}>{r.walletName ?? "—"}</div>
            <div className="num" style={{ textAlign: "right", fontWeight: 600, color: r.isIncome ? "#4fa98a" : "#d0658a" }}>
              {(r.isIncome ? "+" : "−") + fmtBaht(r.amount).slice(1)}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 40, color: "#b8a9d0", fontSize: 13.5 }}>
            ยังไม่มีรายการในบัญชีนี้
          </div>
        )}
      </div>
    </div>
  );
}
