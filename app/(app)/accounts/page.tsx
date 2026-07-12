import { getAccountsWithBalance } from "@/lib/accounts";
import { getCurrentUser } from "@/lib/session";
import { AccountsClient } from "./AccountsClient";

export default async function AccountsPage() {
  const [accounts, user] = await Promise.all([getAccountsWithBalance(), getCurrentUser()]);

  const view = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    number: a.number,
    balance: a.balance,
    openingBalance: a.openingBalance,
  }));

  return <AccountsClient accounts={view} canEdit={user?.role === "ADMIN"} />;
}
