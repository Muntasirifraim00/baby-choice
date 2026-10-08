import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { LoginPage } from "@/components/pages/login-page";
export const Route = createFileRoute("/login")({ head: () => liveHead("Login", "Log in to Baby Choice to save your wishlist, check out faster and track orders."), component: LoginPage });

