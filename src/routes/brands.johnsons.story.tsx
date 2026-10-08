import { createFileRoute } from "@tanstack/react-router";
import { liveHead } from "@/lib/live-head";
import { JohnsonsStory } from "@/components/pages/johnsons-pages";
export const Route = createFileRoute("/brands/johnsons/story")({ head: () => liveHead("Johnson's Brand Story", "Explore Johnson's baby care range, categories and featured products."), component: Page });

function Page(){return <JohnsonsStory/>;}
