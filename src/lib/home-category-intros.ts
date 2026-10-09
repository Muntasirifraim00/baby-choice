import clothingPhone from "@/assets/home/category-intros/clothing-phone.png.asset.json";
import clothingDesktop from "@/assets/home/category-intros/clothing-desktop.png.asset.json";
import diaperingPhone from "@/assets/home/category-intros/diapering-phone.png.asset.json";
import diaperingDesktop from "@/assets/home/category-intros/diapering-desktop.png.asset.json";
import feedingPhone from "@/assets/home/category-intros/feeding-phone.png.asset.json";
import feedingDesktop from "@/assets/home/category-intros/feeding-desktop.png.asset.json";
import bathPhone from "@/assets/home/category-intros/bath-phone.png.asset.json";
import bathDesktop from "@/assets/home/category-intros/bath-desktop.png.asset.json";
import toysPhone from "@/assets/home/category-intros/toys-phone.png.asset.json";
import toysDesktop from "@/assets/home/category-intros/toys-desktop.png.asset.json";
import healthPhone from "@/assets/home/category-intros/health-phone.png.asset.json";
import healthDesktop from "@/assets/home/category-intros/health-desktop.png.asset.json";
import gearPhone from "@/assets/home/category-intros/gear-phone.png.asset.json";
import gearDesktop from "@/assets/home/category-intros/gear-desktop.png.asset.json";

export const homeCategoryIntros = [
  { title: "Clothing", category: "Clothing", cat: "baby-clothing", bg: "#e6f2ff", deep: "#2f5bd3", phone: clothingPhone.url, desktop: clothingDesktop.url },
  { title: "Diapering", category: "Diapers", cat: "diapers-and-wipes", bg: "#ffe6ef", deep: "#c21e55", phone: diaperingPhone.url, desktop: diaperingDesktop.url },
  { title: "Feeding", category: "Feeding", cat: "feeding-and-nursing", bg: "#fff3d1", deep: "#b06d00", phone: feedingPhone.url, desktop: feedingDesktop.url },
  { title: "Bath & care", category: "Bath & Skin", cat: "bath-and-hygiene", bg: "#e3f4ff", deep: "#2f7de0", phone: bathPhone.url, desktop: bathDesktop.url },
  { title: "Toys", category: "Toys", cat: "toys-and-learning", bg: "#e2f8ee", deep: "#136b40", phone: toysPhone.url, desktop: toysDesktop.url },
  { title: "Health", category: "Health", cat: "health-and-safety", bg: "#fff0e4", deep: "#b4470f", phone: healthPhone.url, desktop: healthDesktop.url },
  { title: "Gear & gifts", category: "Baby Care", cat: "baby-accessories", bg: "#efe8ff", deep: "#4c22b8", phone: gearPhone.url, desktop: gearDesktop.url },
] as const;