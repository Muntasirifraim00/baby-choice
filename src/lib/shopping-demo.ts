const assets = import.meta.glob<{ default: { url: string } }>("../assets/*.jpg.asset.json", { eager: true });
export const shoppingImage = (name: string) => assets[`../assets/${name}.jpg.asset.json`]?.default.url ?? "";
export const shoppingHead = (title: string, description: string) => ({ meta: [{ title: `${title} — Baby Choice` }, { name: "description", content: description }, { property: "og:title", content: `${title} — Baby Choice` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] });
export const shoppingProducts = [
 {id:"diapers",name:"Pampers New Baby Diapers",description:"Soft & Dry Protection",rating:"4.8 (450)",price:"1,350",old:"1,780",sizes:["S","M","L","XL"],badge:"#1 Trending"},
 {id:"shampoo",name:"Johnson’s Baby Shampoo",description:"No More Tears",rating:"4.8 (320)",price:"620",old:"780",sizes:["200ml","500ml","750ml"],badge:"Best Seller"},
 {id:"lotion",name:"Johnson’s Baby Lotion",description:"Mild & Gentle",rating:"4.7 (210)",price:"650",old:"820",sizes:["200ml","500ml"],badge:"Trending"},
 {id:"cetaphil",name:"Cetaphil Baby Wash",description:"With Organic Calendula",rating:"4.7 (198)",price:"1,150",old:"1,400",sizes:["200ml","400ml"],badge:"New Arrival"},
 {id:"wipes",name:"Johnson’s Baby Wipes",description:"Extra Gentle",rating:"4.8 (246)",price:"320",old:"420",sizes:["72 pcs","120 pcs"],badge:"Trending"},
 {id:"cup",name:"Nuby Sippy Cup",description:"Easy Grip & Spill Proof",rating:"4.6 (176)",price:"890",old:"1,050",sizes:["6+ Months","12+ Months"],badge:"Popular"},
 {id:"aveeno",name:"Aveeno Baby Lotion",description:"Daily Moisturizing Care",rating:"4.8 (288)",price:"1,420",old:"1,780",sizes:["236ml","354ml"],badge:"Trending"},
 {id:"chicco",name:"Chicco Feeding Bottle",description:"Safe & Easy Feeding",rating:"4.7 (320)",price:"1,250",old:"1,550",sizes:["150ml","250ml","330ml"],badge:"Best Seller"},
 {id:"avent",name:"Philips Avent Bottle Set",description:"Trusted by Parents",rating:"4.8 (412)",price:"2,200",old:"2,750",sizes:["3 Pieces Set"],badge:"Trending"},
 {id:"cerelac",name:"Nestlé Cerelac Wheat Apple",description:"",rating:"4.7 (312)",price:"450",old:"640",sizes:["400g"],badge:"Must Have"},
];
export type ShoppingProduct = typeof shoppingProducts[number];
