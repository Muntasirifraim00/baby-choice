import { createFileRoute } from "@tanstack/react-router";
import { WishlistPage } from "@/components/pages/wishlist-page";
import { liveHead } from "@/lib/live-head";
export const Route = createFileRoute("/wishlist")({ head: () => liveHead("My Wishlist", "Your saved baby products — move them to cart any time."), component: WishlistPage });
