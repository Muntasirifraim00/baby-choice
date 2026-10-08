import productImage0 from "@/assets/products/johnsons-baby-shampoo.jpg";
import productImage1 from "@/assets/products/pampers-new-baby-diapers.jpg";
import productImage2 from "@/assets/products/johnsons-baby-lotion.jpg";
import productImage3 from "@/assets/products/cetaphil-baby-wash.jpg";
import productImage4 from "@/assets/products/johnsons-baby-wipes.jpg";
import productImage5 from "@/assets/products/nuby-sippy-cup.jpg";
import productImage6 from "@/assets/products/aveeno-baby-lotion.jpg";
import productImage7 from "@/assets/products/chicco-feeding-bottle.jpg";
import productImage8 from "@/assets/products/philips-avent-bottle-set.jpg";
import productImage9 from "@/assets/products/nestle-cerelac-wheat-apple.jpg";
import productImage10 from "@/assets/products/sudocrem-nappy-rash-cream.jpg";
import productImage11 from "@/assets/products/carters-honey-cotton-wash-cloth.jpg";
import productImage12 from "@/assets/products/aptamil-advance-follow-on-milk.jpg";
import productImage13 from "@/assets/products/baby-hooded-towel.jpg";
import productImage14 from "@/assets/products/carters-girl-bodysuit-set.jpg";
import productImage15 from "@/assets/products/carters-boy-bodysuit-pack.jpg";
import productImage16 from "@/assets/products/girl-party-dress-bow.jpg";
import productImage17 from "@/assets/products/winter-romper-panda.jpg";
import productImage18 from "@/assets/products/girl-pajama-set.jpg";
import productImage19 from "@/assets/products/boy-romper-striped.jpg";
import productImage20 from "@/assets/products/cetaphil-gentle-wash-shampoo.jpg";
import productImage21 from "@/assets/products/himalaya-baby-shampoo.jpg";
import productImage22 from "@/assets/products/aveeno-baby-shampoo.jpg";
import productImage23 from "@/assets/products/baby-dove-shampoo.jpg";
import productImage24 from "@/assets/products/sebamed-baby-shampoo.jpg";
import productImage25 from "@/assets/products/johnsons-baby-powder.jpg";
import productImage26 from "@/assets/products/johnsons-baby-body-wash.jpg";
import productImage27 from "@/assets/products/johnsons-baby-oil.jpg";
import productImage28 from "@/assets/products/johnsons-bedtime-shampoo.jpg";
import productImage29 from "@/assets/products/johnsons-bedtime-lotion.jpg";
import productImage30 from "@/assets/products/johnsons-baby-care-gift-set.jpg";
import productImage31 from "@/assets/products/huggies-baby-wipes.jpg";
import productImage32 from "@/assets/products/baby-feeding-set.jpg";
import productImage33 from "@/assets/products/baby-clothing-set.jpg";
import productImage34 from "@/assets/products/baby-play-mat.jpg";
import productImage35 from "@/assets/products/baby-stroller.jpg";
import productImage36 from "@/assets/products/baby-rattle-set.jpg";
import productImage37 from "@/assets/products/soft-teddy-bear.jpg";
import productImage38 from "@/assets/products/stacking-rings-toy.jpg";
import productImage39 from "@/assets/products/baby-activity-walker.jpg";
import productImage40 from "@/assets/products/baby-carrier.jpg";
import productImage41 from "@/assets/products/baby-high-chair.jpg";
import productImage42 from "@/assets/products/baby-diaper-bag.jpg";
import productImage43 from "@/assets/products/digital-baby-thermometer.jpg";
import productImage44 from "@/assets/products/electric-breast-pump.jpg";
import productImage45 from "@/assets/products/baby-first-aid-kit.jpg";
import productImage46 from "@/assets/products/baby-nail-care-set.jpg";
import productImage47 from "@/assets/products/huggies-diapers-pack.jpg";
import productImage48 from "@/assets/products/molfix-baby-diapers.jpg";
export type Product = {
  slug: string; brand: string; name: string; sub: string; category: string; type?: string;
  rating: number; reviews: number; price: number; old: number; sizes: string[]; image: string; badge?: string;
};

const p = (slug: string, brand: string, name: string, sub: string, category: string, rating: number, reviews: number, price: number, old: number, sizes: string[], image: string, extra: Partial<Product> = {}): Product =>
  ({ slug, brand, name, sub, category, rating, reviews, price, old, sizes, image, ...extra });

export const products: Product[] = [
  p("johnsons-baby-shampoo", "Johnson's", "Johnson’s Baby Shampoo", "No More Tears", "Bath & Skin", 4.8, 320, 620, 780, ["200ml", "500ml", "750ml"], productImage0, { type: "Shampoo", badge: "Best Seller" }),
  p("pampers-new-baby-diapers", "Pampers", "Pampers New Baby Diapers", "Soft & Dry Protection", "Diapers", 4.8, 450, 1350, 1780, ["S", "M", "L", "XL"], productImage1, { badge: "#1 Trending" }),
  p("johnsons-baby-lotion", "Johnson's", "Johnson’s Baby Lotion", "Mild & Gentle", "Bath & Skin", 4.7, 210, 650, 820, ["200ml", "500ml"], productImage2, { type: "Lotion", badge: "Trending" }),
  p("cetaphil-baby-wash", "Cetaphil", "Cetaphil Baby Wash", "With Organic Calendula", "Bath & Skin", 4.7, 198, 1150, 1400, ["200ml", "400ml"], productImage3, { badge: "New Arrival" }),
  p("johnsons-baby-wipes", "Johnson's", "Johnson’s Baby Wipes", "Extra Gentle", "Diapers", 4.8, 246, 320, 420, ["72 pcs", "120 pcs"], productImage4, { type: "Wipes", badge: "Trending" }),
  p("nuby-sippy-cup", "Nuby", "Nuby Sippy Cup", "Easy Grip & Spill Proof", "Feeding", 4.6, 176, 890, 1050, ["6+ Months", "12+ Months"], productImage5, { badge: "Popular" }),
  p("aveeno-baby-lotion", "Aveeno", "Aveeno Baby Lotion", "Daily Moisturizing Care", "Bath & Skin", 4.8, 288, 1420, 1780, ["236ml", "354ml"], productImage6, { badge: "Trending" }),
  p("chicco-feeding-bottle", "Chicco", "Chicco Feeding Bottle", "Safe & Easy Feeding", "Feeding", 4.7, 320, 1250, 1550, ["150ml", "250ml", "330ml"], productImage7, { badge: "Best Seller" }),
  p("philips-avent-bottle-set", "Philips Avent", "Philips Avent Bottle Set", "Trusted by Parents", "Feeding", 4.8, 412, 2200, 2750, ["3 Pieces Set"], productImage8, { badge: "Trending" }),
  p("nestle-cerelac-wheat-apple", "Nestlé", "Nestlé Cerelac Wheat Apple", "Baby Cereal", "Feeding", 4.7, 312, 450, 640, ["400g"], productImage9, { badge: "Must Have" }),
  p("sudocrem-nappy-rash-cream", "Sudocrem", "Sudocrem – Antiseptic Healing Nappy Rash Cream", "Code 14004BG", "Health", 4.8, 320, 890, 1010, ["60g", "125g"], productImage10),
  p("carters-honey-cotton-wash-cloth", "Carter's", "Carter's Honey Cotton Baby Wash Cloth Towel", "Code 11882", "Bath & Skin", 4.7, 210, 650, 810, ["Pack of 6"], productImage11),
  p("aptamil-advance-follow-on-milk", "Aptamil", "Aptamil Advance Follow On Milk Powder", "Code 10120", "Feeding", 4.9, 425, 2450, 2880, ["400g", "800g"], productImage12, { badge: "Top Rated" }),
  p("baby-hooded-towel", "Baby Choice", "Baby Hooded Towel for Newborns (Soft Cotton)", "Code 11876", "Bath & Skin", 4.8, 198, 790, 880, ["One Size"], productImage13),
  p("carters-girl-bodysuit-set", "Carter's", "Baby Girl 3-Pack Cotton Bodysuit Set", "Premium Cotton", "Clothing", 4.8, 320, 1250, 1560, ["0-3M", "3-6M", "6-12M"], productImage14, { type: "Bodysuits" }),
  p("carters-boy-bodysuit-pack", "Carter's", "Baby Boy Cotton Bodysuit Pack (3 Pcs)", "Premium Cotton", "Clothing", 4.7, 210, 1320, 1550, ["0-3M", "3-6M", "6-12M"], productImage15, { type: "Bodysuits" }),
  p("girl-party-dress-bow", "Baby Choice", "Baby Girl Party Dress with Bow", "Party Wear", "Clothing", 4.8, 198, 1690, 1880, ["6-12M", "1-2Y", "2-3Y"], productImage16, { type: "Sets" }),
  p("winter-romper-panda", "Baby Choice", "Baby Winter Romper with Hood (Panda)", "Warm & Cozy", "Clothing", 4.9, 245, 1490, 1990, ["3-6M", "6-12M", "1-2Y"], productImage17, { type: "Winter Wear" }),
  p("girl-pajama-set", "Baby Choice", "Baby Girl Pajama Set (3 Pcs)", "Soft Sleepwear", "Clothing", 4.8, 176, 1150, 1300, ["6-12M", "1-2Y", "2-3Y"], productImage18, { type: "Pants" }),
  p("boy-romper-striped", "Carter's", "Baby Boy Romper Striped Design", "Everyday Wear", "Clothing", 4.7, 190, 1390, 1690, ["0-3M", "3-6M", "6-12M"], productImage19, { type: "Romper" }),
  p("cetaphil-gentle-wash-shampoo", "Cetaphil", "Cetaphil Baby Gentle Wash & Shampoo", "Tear Free", "Bath & Skin", 4.7, 210, 980, 1150, ["230ml", "400ml"], productImage20, { badge: "Best Seller" }),
  p("himalaya-baby-shampoo", "Himalaya", "Himalaya Baby Shampoo Gentle & Mild", "Natural Ingredients", "Bath & Skin", 4.6, 198, 450, 500, ["200ml", "400ml"], productImage21),
  p("aveeno-baby-shampoo", "Aveeno", "Aveeno Baby Shampoo Daily Moisture", "Oat Extract", "Bath & Skin", 4.8, 286, 1250, 1650, ["236ml", "354ml"], productImage22),
  p("baby-dove-shampoo", "Baby Dove", "Baby Dove Shampoo Rich Moisture", "Tip to Toe", "Bath & Skin", 4.7, 174, 890, 1010, ["200ml", "400ml"], productImage23, { badge: "New" }),
  p("sebamed-baby-shampoo", "Sebamed", "Sebamed Baby Shampoo Extra Mild (pH 5.5)", "Extra Mild", "Bath & Skin", 4.6, 132, 1150, 1400, ["200ml", "400ml"], productImage24),
  p("johnsons-baby-powder", "Johnson's", "Johnson’s Baby Powder", "Soft & Fresh", "Bath & Skin", 4.8, 280, 590, 750, ["100g", "200g"], productImage25, { type: "Powder" }),
  p("johnsons-baby-body-wash", "Johnson's", "Johnson’s Baby Body Wash", "Top-to-Toe", "Bath & Skin", 4.7, 198, 680, 850, ["200ml", "500ml"], productImage26, { type: "Body Wash" }),
  p("johnsons-baby-oil", "Johnson's", "Johnson’s Baby Oil", "Locks in Moisture", "Bath & Skin", 4.7, 156, 720, 960, ["100ml", "200ml"], productImage27, { type: "Oil" }),
  p("johnsons-bedtime-shampoo", "Johnson's", "Johnson’s Bedtime Shampoo", "Calming Lavender", "Bath & Skin", 4.8, 142, 680, 810, ["200ml", "500ml"], productImage28, { type: "Shampoo" }),
  p("johnsons-bedtime-lotion", "Johnson's", "Johnson’s Bedtime Lotion", "Sleep Better", "Bath & Skin", 4.7, 128, 720, 840, ["200ml", "500ml"], productImage29, { type: "Lotion" }),
  p("johnsons-baby-care-gift-set", "Johnson's", "Johnson’s Baby Care Gift Set", "Shampoo, Lotion, Powder & Towel", "Baby Care", 4.9, 96, 1250, 1520, ["Gift Box"], productImage30, { type: "Gift Set", badge: "Gift Pick" }),
  p("huggies-baby-wipes", "Huggies", "Huggies Baby Wipes", "Pure & Gentle", "Diapers", 4.7, 230, 320, 420, ["56 pcs", "112 pcs"], productImage31),
  p("baby-feeding-set", "Baby Choice", "Baby Feeding Set", "Plate, Bowl, Spoon, Cup & Bib", "Feeding", 4.7, 140, 890, 1120, ["5 Pieces"], productImage32),
  p("baby-clothing-set", "Baby Choice", "Baby Clothing Set", "Soft Cotton 5 Pcs", "Clothing", 4.8, 160, 1190, 1450, ["0-3M", "3-6M", "6-12M"], productImage33),
  p("baby-play-mat", "Baby Choice", "Baby Play Mat", "Activity Gym with Toys", "Toys", 4.8, 120, 1590, 1980, ["One Size"], productImage34, { badge: "Popular" }),
  p("baby-stroller", "Baby Choice", "Baby Stroller", "Lightweight & Foldable", "Baby Care", 4.9, 88, 4990, 5990, ["Standard"], productImage35),
  p("baby-rattle-set", "Baby Choice", "Baby Rattle Set", "5 Pcs Colorful Rattles", "Toys", 4.7, 154, 450, 590, ["5 Pieces"], productImage36, { badge: "Popular" }),
  p("soft-teddy-bear", "Baby Choice", "Soft Teddy Bear", "Plush Cuddle Toy", "Toys", 4.8, 132, 690, 890, ["Small", "Medium"], productImage37),
  p("stacking-rings-toy", "Baby Choice", "Stacking Rings Tower", "Early Learning Toy", "Toys", 4.7, 118, 390, 490, ["7 Rings"], productImage38),
  p("baby-activity-walker", "Baby Choice", "Baby Activity Walker", "With Music & Toys", "Toys", 4.8, 96, 2450, 2950, ["Standard"], productImage39, { badge: "New" }),
  p("baby-carrier", "Baby Choice", "Baby Carrier Sling", "Ergonomic & Soft", "Baby Care", 4.8, 142, 1890, 2290, ["One Size"], productImage40),
  p("baby-high-chair", "Baby Choice", "Baby High Chair", "Adjustable with Tray", "Baby Care", 4.8, 110, 3490, 4290, ["Standard"], productImage41, { badge: "Best Seller" }),
  p("baby-diaper-bag", "Baby Choice", "Baby Diaper Bag", "Multi-Pocket Travel Bag", "Baby Care", 4.7, 128, 1590, 1990, ["Standard"], productImage42),
  p("digital-baby-thermometer", "Baby Choice", "Digital Baby Thermometer", "Fast & Accurate Reading", "Health", 4.8, 210, 350, 450, ["One Size"], productImage43),
  p("electric-breast-pump", "Baby Choice", "Electric Breast Pump", "Double Pump with Display", "Health", 4.8, 176, 3990, 4890, ["Standard"], productImage44, { badge: "Top Rated" }),
  p("baby-first-aid-kit", "Baby Choice", "Baby First Aid Kit", "Essential Care Set", "Health", 4.7, 94, 890, 1090, ["12 Pieces"], productImage45),
  p("baby-nail-care-set", "Baby Choice", "Baby Nail Care Set", "Safe Trimming Kit", "Health", 4.6, 88, 420, 550, ["4 Pieces"], productImage46),
  p("huggies-diapers-pack", "Huggies", "Huggies Baby Diapers", "Dry Comfort Protection", "Diapers", 4.7, 260, 1250, 1490, ["S", "M", "L", "XL"], productImage47),
  p("molfix-baby-diapers", "Molfix", "Molfix Baby Diapers", "Soft & Breathable", "Diapers", 4.6, 190, 1150, 1390, ["S", "M", "L", "XL"], productImage48),
];

export const getProduct = (slug: string) => products.find(x => x.slug === slug);
export const pick = (...slugs: string[]) => slugs.map(getProduct).filter((x): x is Product => !!x);
export const tk = (n: number) => n.toLocaleString("en-US");
export const off = (x: Product) => Math.round((1 - x.price / x.old) * 100);
export const johnsons = products.filter(x => x.brand === "Johnson's");
