import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { SupportPage } from "@/components/pages/support-page";
export const Route = createFileRoute("/support")({ head: () => liveHead("Customer Support", "Get help with orders, delivery and payments — call, WhatsApp or email Baby Choice."), component: SupportPage });

