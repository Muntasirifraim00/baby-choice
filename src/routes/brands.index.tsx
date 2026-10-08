import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { BrandsPage } from "@/components/pages/brands-page";
export const Route = createFileRoute("/brands/")({ head: () => liveHead("All Brands", "Shop trusted baby brands: Johnson's, Cetaphil, Himalaya, Aveeno, Dove, Pampers and more."), component: BrandsPage });

