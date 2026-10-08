import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { AccountPage } from "@/components/pages/account-page";
export const Route = createFileRoute("/account")({ head: () => liveHead("My Account", "Manage your Baby Choice orders, wishlist, addresses and payment methods."), component: AccountPage });

