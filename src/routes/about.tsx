import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { AboutPage } from "@/components/pages/about-page";
export const Route = createFileRoute("/about")({ head: () => liveHead("About & Contact", "About Baby Choice — everything for your little one. Contact us in Dhanmondi, Dhaka."), component: AboutPage });

