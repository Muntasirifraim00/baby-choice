import oil from "@/assets/gen-oil.jpg";
import playmat from "@/assets/gen-playmat.jpg";
import stroller from "@/assets/gen-stroller.jpg";
import giftset from "@/assets/gen-giftset.jpg";
import feeding from "@/assets/gen-feeding.jpg";
import rattle from "@/assets/gen-rattle.jpg";
import teddy from "@/assets/gen-teddy.jpg";
import carrier from "@/assets/gen-carrier.jpg";
import highchair from "@/assets/gen-highchair.jpg";
import thermometer from "@/assets/gen-thermometer.jpg";
import walker from "@/assets/gen-walker.jpg";
import stacking from "@/assets/gen-stacking.jpg";
import breastpump from "@/assets/gen-breastpump.jpg";

const pointers = import.meta.glob<{ default: { url: string } }>("../assets/*.asset.json", { eager: true });
const a = (file: string) => pointers[`../assets/${file}.asset.json`]?.default.url ?? "";

export type Product = {
  slug: string; brand: string; name: string; sub: string; category: string; type?: string;
  rating: number; reviews: number; price: number; old: number; sizes: string[]; image: string; badge?: string;
};

const p = (slug: string, brand: string, name: string, sub: string, category: string, rating: number, reviews: number, price: number, old: number, sizes: string[], image: string, extra: Partial<Product> = {}): Product =>
  ({ slug, brand, name, sub, category, rating, reviews, price, old, sizes, image, ...extra });

export const products: Product[] = [
  p("johnsons-baby-shampoo", "Johnson's", "Johnson’s Baby Shampoo", "No More Tears", "Bath & Skin", 4.8, 320, 620, 780, ["200ml", "500ml", "750ml"], a("clean-shampoo.jpg"), { type: "Shampoo", badge: "Best Seller" }),
  p("pampers-new-baby-diapers", "Pampers", "Pampers New Baby Diapers", "Soft & Dry Protection", "Diapers", 4.8, 450, 1350, 1780, ["S", "M", "L", "XL"], a("clean-diapers.jpg"), { badge: "#1 Trending" }),
  p("johnsons-baby-lotion", "Johnson's", "Johnson’s Baby Lotion", "Mild & Gentle", "Bath & Skin", 4.7, 210, 650, 820, ["200ml", "500ml"], a("clean-lotion.jpg"), { type: "Lotion", badge: "Trending" }),
  p("cetaphil-baby-wash", "Cetaphil", "Cetaphil Baby Wash", "With Organic Calendula", "Bath & Skin", 4.7, 198, 1150, 1400, ["200ml", "400ml"], a("clean-cetaphil.jpg"), { badge: "New Arrival" }),
  p("johnsons-baby-wipes", "Johnson's", "Johnson’s Baby Wipes", "Extra Gentle", "Diapers", 4.8, 246, 320, 420, ["72 pcs", "120 pcs"], a("clean-wipes.jpg"), { type: "Wipes", badge: "Trending" }),
  p("nuby-sippy-cup", "Nuby", "Nuby Sippy Cup", "Easy Grip & Spill Proof", "Feeding", 4.6, 176, 890, 1050, ["6+ Months", "12+ Months"], a("next-cup.jpg"), { badge: "Popular" }),
  p("aveeno-baby-lotion", "Aveeno", "Aveeno Baby Lotion", "Daily Moisturizing Care", "Bath & Skin", 4.8, 288, 1420, 1780, ["236ml", "354ml"], a("next-aveeno.jpg"), { badge: "Trending" }),
  p("chicco-feeding-bottle", "Chicco", "Chicco Feeding Bottle", "Safe & Easy Feeding", "Feeding", 4.7, 320, 1250, 1550, ["150ml", "250ml", "330ml"], a("next-chicco.jpg"), { badge: "Best Seller" }),
  p("philips-avent-bottle-set", "Philips Avent", "Philips Avent Bottle Set", "Trusted by Parents", "Feeding", 4.8, 412, 2200, 2750, ["3 Pieces Set"], a("next-avent.jpg"), { badge: "Trending" }),
  p("nestle-cerelac-wheat-apple", "Nestlé", "Nestlé Cerelac Wheat Apple", "Baby Cereal", "Feeding", 4.7, 312, 450, 640, ["400g"], a("next-cerelac.jpg"), { badge: "Must Have" }),
  p("sudocrem-nappy-rash-cream", "Sudocrem", "Sudocrem – Antiseptic Healing Nappy Rash Cream", "Code 14004BG", "Health", 4.8, 320, 890, 1010, ["60g", "125g"], a("product-1.png")),
  p("carters-honey-cotton-wash-cloth", "Carter's", "Carter's Honey Cotton Baby Wash Cloth Towel", "Code 11882", "Bath & Skin", 4.7, 210, 650, 810, ["Pack of 6"], a("product-2.png")),
  p("aptamil-advance-follow-on-milk", "Aptamil", "Aptamil Advance Follow On Milk Powder", "Code 10120", "Feeding", 4.9, 425, 2450, 2880, ["400g", "800g"], a("product-3.png"), { badge: "Top Rated" }),
  p("baby-hooded-towel", "Baby Choice", "Baby Hooded Towel for Newborns (Soft Cotton)", "Code 11876", "Bath & Skin", 4.8, 198, 790, 880, ["One Size"], a("product-4.png")),
  p("carters-girl-bodysuit-set", "Carter's", "Baby Girl 3-Pack Cotton Bodysuit Set", "Premium Cotton", "Clothing", 4.8, 320, 1250, 1560, ["0-3M", "3-6M", "6-12M"], a("clothing-product-1.png"), { type: "Bodysuits" }),
  p("carters-boy-bodysuit-pack", "Carter's", "Baby Boy Cotton Bodysuit Pack (3 Pcs)", "Premium Cotton", "Clothing", 4.7, 210, 1320, 1550, ["0-3M", "3-6M", "6-12M"], a("clothing-product-2.png"), { type: "Bodysuits" }),
  p("girl-party-dress-bow", "Baby Choice", "Baby Girl Party Dress with Bow", "Party Wear", "Clothing", 4.8, 198, 1690, 1880, ["6-12M", "1-2Y", "2-3Y"], a("clothing-product-3.png"), { type: "Sets" }),
  p("winter-romper-panda", "Baby Choice", "Baby Winter Romper with Hood (Panda)", "Warm & Cozy", "Clothing", 4.9, 245, 1490, 1990, ["3-6M", "6-12M", "1-2Y"], a("clothing-product-4.png"), { type: "Winter Wear" }),
  p("girl-pajama-set", "Baby Choice", "Baby Girl Pajama Set (3 Pcs)", "Soft Sleepwear", "Clothing", 4.8, 176, 1150, 1300, ["6-12M", "1-2Y", "2-3Y"], a("clothing-product-5.png"), { type: "Pants" }),
  p("boy-romper-striped", "Carter's", "Baby Boy Romper Striped Design", "Everyday Wear", "Clothing", 4.7, 190, 1390, 1690, ["0-3M", "3-6M", "6-12M"], a("clothing-product-6.png"), { type: "Romper" }),
  p("cetaphil-gentle-wash-shampoo", "Cetaphil", "Cetaphil Baby Gentle Wash & Shampoo", "Tear Free", "Bath & Skin", 4.7, 210, 980, 1150, ["230ml", "400ml"], a("search-clean-product-2.png"), { badge: "Best Seller" }),
  p("himalaya-baby-shampoo", "Himalaya", "Himalaya Baby Shampoo Gentle & Mild", "Natural Ingredients", "Bath & Skin", 4.6, 198, 450, 500, ["200ml", "400ml"], a("search-clean-product-3.png")),
  p("aveeno-baby-shampoo", "Aveeno", "Aveeno Baby Shampoo Daily Moisture", "Oat Extract", "Bath & Skin", 4.8, 286, 1250, 1650, ["236ml", "354ml"], a("search-clean-product-4.png")),
  p("baby-dove-shampoo", "Baby Dove", "Baby Dove Shampoo Rich Moisture", "Tip to Toe", "Bath & Skin", 4.7, 174, 890, 1010, ["200ml", "400ml"], a("search-clean-product-5.png"), { badge: "New" }),
  p("sebamed-baby-shampoo", "Sebamed", "Sebamed Baby Shampoo Extra Mild (pH 5.5)", "Extra Mild", "Bath & Skin", 4.6, 132, 1150, 1400, ["200ml", "400ml"], a("search-clean-product-6.png")),
  p("johnsons-baby-powder", "Johnson's", "Johnson’s Baby Powder", "Soft & Fresh", "Bath & Skin", 4.8, 280, 590, 750, ["100g", "200g"], a("pd-like2.png"), { type: "Powder" }),
  p("johnsons-baby-body-wash", "Johnson's", "Johnson’s Baby Body Wash", "Top-to-Toe", "Bath & Skin", 4.7, 198, 680, 850, ["200ml", "500ml"], a("pd-like3.png"), { type: "Body Wash" }),
  p("johnsons-baby-oil", "Johnson's", "Johnson’s Baby Oil", "Locks in Moisture", "Bath & Skin", 4.7, 156, 720, 960, ["100ml", "200ml"], oil, { type: "Oil" }),
  p("johnsons-bedtime-shampoo", "Johnson's", "Johnson’s Bedtime Shampoo", "Calming Lavender", "Bath & Skin", 4.8, 142, 680, 810, ["200ml", "500ml"], a("search-clean-product-1.png"), { type: "Shampoo" }),
  p("johnsons-bedtime-lotion", "Johnson's", "Johnson’s Bedtime Lotion", "Sleep Better", "Bath & Skin", 4.7, 128, 720, 840, ["200ml", "500ml"], a("pd-like1.png"), { type: "Lotion" }),
  p("johnsons-baby-care-gift-set", "Johnson's", "Johnson’s Baby Care Gift Set", "Shampoo, Lotion, Powder & Towel", "Baby Care", 4.9, 96, 1250, 1520, ["Gift Box"], giftset, { type: "Gift Set", badge: "Gift Pick" }),
  p("huggies-baby-wipes", "Huggies", "Huggies Baby Wipes", "Pure & Gentle", "Diapers", 4.7, 230, 320, 420, ["56 pcs", "112 pcs"], a("next-wipes.jpg")),
  p("baby-feeding-set", "Baby Choice", "Baby Feeding Set", "Plate, Bowl, Spoon, Cup & Bib", "Feeding", 4.7, 140, 890, 1120, ["5 Pieces"], feeding),
  p("baby-clothing-set", "Baby Choice", "Baby Clothing Set", "Soft Cotton 5 Pcs", "Clothing", 4.8, 160, 1190, 1450, ["0-3M", "3-6M", "6-12M"], a("category-1.png")),
  p("baby-play-mat", "Baby Choice", "Baby Play Mat", "Activity Gym with Toys", "Toys", 4.8, 120, 1590, 1980, ["One Size"], playmat, { badge: "Popular" }),
  p("baby-stroller", "Baby Choice", "Baby Stroller", "Lightweight & Foldable", "Baby Care", 4.9, 88, 4990, 5990, ["Standard"], stroller),
  p("baby-rattle-set", "Baby Choice", "Baby Rattle Set", "5 Pcs Colorful Rattles", "Toys", 4.7, 154, 450, 590, ["5 Pieces"], rattle, { badge: "Popular" }),
  p("soft-teddy-bear", "Baby Choice", "Soft Teddy Bear", "Plush Cuddle Toy", "Toys", 4.8, 132, 690, 890, ["Small", "Medium"], teddy),
  p("stacking-rings-toy", "Baby Choice", "Stacking Rings Tower", "Early Learning Toy", "Toys", 4.7, 118, 390, 490, ["7 Rings"], stacking),
  p("baby-activity-walker", "Baby Choice", "Baby Activity Walker", "With Music & Toys", "Toys", 4.8, 96, 2450, 2950, ["Standard"], walker, { badge: "New" }),
  p("baby-carrier", "Baby Choice", "Baby Carrier Sling", "Ergonomic & Soft", "Baby Care", 4.8, 142, 1890, 2290, ["One Size"], carrier),
  p("baby-high-chair", "Baby Choice", "Baby High Chair", "Adjustable with Tray", "Baby Care", 4.8, 110, 3490, 4290, ["Standard"], highchair, { badge: "Best Seller" }),
  p("baby-diaper-bag", "Baby Choice", "Baby Diaper Bag", "Multi-Pocket Travel Bag", "Baby Care", 4.7, 128, 1590, 1990, ["Standard"], a("category-14.png")),
  p("digital-baby-thermometer", "Baby Choice", "Digital Baby Thermometer", "Fast & Accurate Reading", "Health", 4.8, 210, 350, 450, ["One Size"], thermometer),
  p("electric-breast-pump", "Baby Choice", "Electric Breast Pump", "Double Pump with Display", "Health", 4.8, 176, 3990, 4890, ["Standard"], breastpump, { badge: "Top Rated" }),
  p("baby-first-aid-kit", "Baby Choice", "Baby First Aid Kit", "Essential Care Set", "Health", 4.7, 94, 890, 1090, ["12 Pieces"], a("category-13.png")),
  p("baby-nail-care-set", "Baby Choice", "Baby Nail Care Set", "Safe Trimming Kit", "Health", 4.6, 88, 420, 550, ["4 Pieces"], a("category-12.png")),
  p("huggies-diapers-pack", "Huggies", "Huggies Baby Diapers", "Dry Comfort Protection", "Diapers", 4.7, 260, 1250, 1490, ["S", "M", "L", "XL"], a("next-diapers.jpg")),
  p("molfix-baby-diapers", "Molfix", "Molfix Baby Diapers", "Soft & Breathable", "Diapers", 4.6, 190, 1150, 1390, ["S", "M", "L", "XL"], a("category-3.png")),
];

export const getProduct = (slug: string) => products.find(x => x.slug === slug);
export const pick = (...slugs: string[]) => slugs.map(getProduct).filter((x): x is Product => !!x);
export const tk = (n: number) => n.toLocaleString("en-US");
export const off = (x: Product) => Math.round((1 - x.price / x.old) * 100);
export const johnsons = products.filter(x => x.brand === "Johnson's");
