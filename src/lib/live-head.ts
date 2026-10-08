export const liveHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Baby Choice` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Baby Choice` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

export const slugify = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const categoryMap: Record<string, string[]> = {
  "baby-clothing": ["Clothing"], "panjabi-and-pajamas": ["Clothing"], "diapers-and-wipes": ["Diapers"], "feeding-and-nursing": ["Feeding"],
  "bath-and-hygiene": ["Bath & Skin"], "skin-care": ["Bath & Skin", "Health"], "toys-and-learning": ["Toys"], "strollers-and-prams": ["Baby Care"],
  "high-chairs-and-boosters": ["Feeding", "Baby Care"], "bedding-and-blankets": ["Clothing", "Baby Care"], "mother-and-maternity": ["Health", "Feeding"],
  "baby-accessories": ["Baby Care", "Toys"], "health-and-safety": ["Health"], "outdoor-and-travel": ["Baby Care"], "school-and-activity": ["Toys"], "gifts-and-hampers": ["Baby Care", "Toys"],
};
