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

      <Link href="/accounts" style={{ display: "inline-block", border: "none", background: "none", color: "#79668F", fontSize: 13.5, padding: 0, marginBottom: 16 }}>
        ← กลับไปหน้าบัญชี
      </Link>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 170, background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", color: "#fff", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#EDE3FF" }}>ยอดคงเหลือปัจจุบัน</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
            {fmtBaht(account.balance)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 170, background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>รับเข้าบัญชีนี้</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#10B981" }}>
            {"+" + fmtBaht(incSum).slice(1)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 170, background: "#fff", border: "1px solid #E9D5FF", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 12.5, color: "#8B7CA6" }}>จ่ายจากบัญชีนี้</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: "#F43F5E" }}>
            {"−" + fmtBaht(expSum).slice(1)}
          </div>
        </div>
      </div>

      <WalletsSection
        accountId={id}
        wallets={wallets.map((w) => ({ id: w.id, name: w.name, balance: w.balance, openingBalance: w.openingBalance }))}
        canEdit={canEdit}
      />

      <div style={{ background: "#fff", border: "1px solid #E9D5FF", borderRadius: 18, overflow: "hidden" }}>
        <div
          className="resp-table-head"
          style={{
            display: "grid",
            gridTemplateColumns: "110px 90px 1.2fr 1fr 1fr 140px",
            gap: 12,
            padding: "14px 22px",
            background: "#FAF5FF",
            borderBottom: "1px solid #F3E8FF",
            fontSize: 12,
            fontWeight: 600,
            color: "#8B7CA6",
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
            className="resp-table-row"
            style={{
              display: "grid",
              gridTemplateColumns: "110px 90px 1.2fr 1fr 1fr 140px",
              gap: 12,
              padding: "14px 22px",
              borderBottom: "1px solid #F3E8FF",
              alignItems: "center",
              fontSize: 13.5,
            }}
          >
            <div data-label="วันที่" className="num" style={{ color: "#79668F" }}>
              {r.dateText}
            </div>
            <div data-label="ประเภท">
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: r.isIncome ? "#D1FAE5" : "#FFE4E9",
                  color: r.isIncome ? "#10B981" : "#F43F5E",
                }}
              >
                {r.isIncome ? "รับ" : "จ่าย"}
              </span>
            </div>
            <div data-label="รายการ" style={{ fontWeight: 500 }}>
              {r.note}
            </div>
            <div data-label="หมวดหมู่" style={{ color: "#79668F", fontSize: 12.5 }}>
              {r.category}
            </div>
            <div data-label="กระเป๋า" style={{ color: "#79668F", fontSize: 12.5 }}>
              {r.walletName ?? "—"}
            </div>
            <div data-label="จำนวนเงิน" className="num resp-table-amount" style={{ textAlign: "right", fontWeight: 600, color: r.isIncome ? "#10B981" : "#F43F5E" }}>
              {(r.isIncome ? "+" : "−") + fmtBaht(r.amount).slice(1)}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 40, color: "#A996C4", fontSize: 13.5 }}>
            ยังไม่มีรายการในบัญชีนี้
          </div>
        )}
      </div>
    </div>
  );
}
