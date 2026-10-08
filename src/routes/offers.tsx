import { createFileRoute } from "@tanstack/react-router";
import { OffersPage } from "@/components/pages/offers-page";
import { liveHead } from "@/lib/live-head";
export const Route = createFileRoute("/offers")({ head: () => liveHead("Offers & Deals", "Big savings for little ones — flash deals, combo offers and clearance up to 70% off."), component: OffersPage });
