import { getProduct } from "@/lib/products";
const imageFor = (slug: string) => ({ url: getProduct(slug)!.image });
const category1 = imageFor("baby-clothing-set");
const category2 = imageFor("girl-pajama-set");
const category3 = imageFor("pampers-new-baby-diapers");
const category4 = imageFor("baby-feeding-set");
const category5 = imageFor("baby-hooded-towel");
const category6 = imageFor("johnsons-baby-lotion");
const category7 = imageFor("baby-rattle-set");
const category8 = imageFor("baby-stroller");
const category9 = imageFor("baby-high-chair");
const category10 = imageFor("carters-honey-cotton-wash-cloth");
const category11 = imageFor("electric-breast-pump");
const category12 = imageFor("baby-nail-care-set");
const category13 = imageFor("baby-first-aid-kit");
const category14 = imageFor("baby-diaper-bag");
const category15 = imageFor("baby-activity-walker");
const category16 = imageFor("johnsons-baby-care-gift-set");
const tab1 = imageFor("baby-clothing-set");
const tab2 = imageFor("carters-girl-bodysuit-set");
const tab3 = imageFor("girl-party-dress-bow");
const tab4 = imageFor("carters-boy-bodysuit-pack");
const tab5 = imageFor("girl-pajama-set");
const tab6 = imageFor("boy-romper-striped");
const tab7 = imageFor("winter-romper-panda");
const product1 = imageFor("carters-girl-bodysuit-set");
const product2 = imageFor("carters-boy-bodysuit-pack");
const product3 = imageFor("girl-party-dress-bow");
const product4 = imageFor("winter-romper-panda");
const product5 = imageFor("girl-pajama-set");
const product6 = imageFor("boy-romper-striped");

export const catalogCategories = [
  { image: category1, name: "Baby Clothing", count: "500+" },
  { image: category2, name: "Panjabi & Pajamas", count: "300+" },
  { image: category3, name: "Diapers & Wipes", count: "200+" },
  { image: category4, name: "Feeding & Nursing", count: "250+" },
  { image: category5, name: "Bath & Hygiene", count: "250+" },
  { image: category6, name: "Skin Care", count: "200+" },
  { image: category7, name: "Toys & Learning", count: "400+" },
  { image: category8, name: "Strollers & Prams", count: "150+" },
  { image: category9, name: "High Chairs & Boosters", count: "120+" },
  { image: category10, name: "Bedding & Blankets", count: "180+" },
  { image: category11, name: "Mother & Maternity", count: "300+" },
  { image: category12, name: "Baby Accessories", count: "250+" },
  { image: category13, name: "Health & Safety", count: "150+" },
  { image: category14, name: "Outdoor & Travel", count: "120+" },
  { image: category15, name: "School & Activity", count: "200+" },
  { image: category16, name: "Gifts & Hampers", count: "100+" },
];
export const clothingTabs = [
  { image: tab1, name: "All" }, { image: tab2, name: "Bodysuits" }, { image: tab3, name: "Sets" },
  { image: tab4, name: "T-Shirts" }, { image: tab5, name: "Pants" }, { image: tab6, name: "Romper" }, { image: tab7, name: "Winter Wear" },
];
export const clothingProducts = [
  { image: product1, brand: "Carter's", title: "Baby Girl 3-Pack Cotton Bodysuit Set", discount: 20, rating: "4.8 (320)", price: "1,250", original: "1,560", sizes: ["0-3M", "3-6M", "6-12M"] },
  { image: product2, brand: "Carter's", title: "Baby Boy Cotton Bodysuit Pack (3 Pcs)", discount: 15, rating: "4.7 (210)", price: "1,320", original: "1,550", sizes: ["0-3M", "3-6M", "6-12M"] },
  { image: product3, brand: "Baby Choice", title: "Baby Girl Party Dress with Bow", discount: 10, rating: "4.8 (198)", price: "1,690", original: "1,880", sizes: ["6-12M", "1-2Y", "2-3Y"] },
  { image: product4, brand: "Baby Choice", title: "Baby Winter Romper with Hood (Panda)", discount: 25, rating: "4.9 (245)", price: "1,490", original: "1,990", sizes: ["3-6M", "6-12M", "1-2Y"] },
  { image: product5, brand: "Baby Choice", title: "Baby Girl Pajama Set (3 Pcs)", discount: 12, rating: "4.8 (176)", price: "1,150", original: "1,300", sizes: ["6-12M", "1-2Y", "2-3Y"] },
  { image: product6, brand: "Carter's", title: "Baby Boy Romper Striped Design", discount: 18, rating: "4.7 (190)", price: "1,390", original: "1,690", sizes: ["0-3M", "3-6M", "6-12M"] },
];