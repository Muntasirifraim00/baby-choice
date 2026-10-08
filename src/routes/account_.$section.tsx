import { createFileRoute, notFound } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { AccountOrders } from "@/components/pages/account-orders";
import { AccountNotifications } from "@/components/pages/account-notifications";
import { AccountSettings } from "@/components/pages/account-settings";
const titles: Record<string, [string, string]> = {
  orders: ["My Orders", "View and track your Baby Choice orders."],
  notifications: ["Notifications", "Manage your Baby Choice notification preferences."],
  settings: ["Account Settings", "Update your Baby Choice account details."],
};

export const Route = createFileRoute("/account_/$section")({
  beforeLoad: ({ params }) => { if (!titles[params.section]) throw notFound(); },
  head: ({ params }) => liveHead(titles[params.section]?.[0] ?? "Account", titles[params.section]?.[1] ?? ""),
  component: Section,
});

function Section(){const {section}=Route.useParams();return section==="orders"?<AccountOrders/>:section==="notifications"?<AccountNotifications/>:<AccountSettings/>}
