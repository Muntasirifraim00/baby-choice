import { catalogCategories } from "@/lib/catalog-demo";
import { categoryMap, slugify } from "@/lib/live-head";
import { products } from "@/lib/products";

export const homeCategories = [
  { slug: "onesies-and-bodysuits", name: "Onesies & Bodysuits", products: ["carters-girl-bodysuit-set", "carters-boy-bodysuit-pack", "baby-clothing-set"] },
  { slug: "panjabi-and-pajamas", name: "Panjabi & Pajamas", products: ["girl-pajama-set"] },
  { slug: "girls-party-dresses", name: "Girls Party Dresses", products: ["girl-party-dress-bow"] },
  { slug: "swaddle-and-receiving", name: "Swaddle & Receiving", products: ["baby-hooded-towel", "carters-honey-cotton-wash-cloth"] },
  { slug: "baby-formula-and-milk", name: "Baby Formula & Milk", products: ["aptamil-advance-follow-on-milk"] },
  { slug: "skin-care", name: "Hair, Body & Skin Care" },
  { slug: "strollers-and-prams", name: "Strollers & Prams", products: ["baby-stroller"] },
  { slug: "high-chairs-and-boosters", name: "High Chairs & Boosters", products: ["baby-high-chair"] },
];

export function getCategoryListing(slug: string) {
  const home = homeCategories.find(c => c.slug === slug);
  const catalog = catalogCategories.find(c => slugify(c.name) === slug);
  const selected = home?.products;
  return {
    name: home?.name ?? catalog?.name ?? "Category",
    image: catalog?.image.url,
    items: products.filter(p => selected ? selected.includes(p.slug) : (categoryMap[slug] ?? []).includes(p.category)),
  };
}