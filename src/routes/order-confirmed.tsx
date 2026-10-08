import { createFileRoute } from "@tanstack/react-router";
import { OrderConfirmedPage } from "@/components/pages/checkout-confirmed";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/order-confirmed")({ head: () => liveHead("Order Confirmed", "Your Baby Choice order is confirmed. Track delivery and review your items."), component: OrderConfirmedPage });
