# Baby Choice — পুরো অ্যাপ live ও clickable করা

## শেষে কী পাবেন
- আপনার দেওয়া সব ২৮টি স্ক্রিন (হোম থেকে Order Confirmed, Login, Account, Wishlist, Support, About) আসল লেখা ও আসল বোতাম দিয়ে তৈরি — সব লেখা পড়া ও কপি করা যাবে।
- ছবি থাকবে শুধু পণ্যের ছবি, ব্যানার আর ব্র্যান্ড লোগোতে। আইকন, বোতাম, মেনু, দাম, ফর্ম — সব আসল।
- স্ক্রিনশটে থাকা সব পণ্য (প্রায় ৪০+টি) একটি তালিকায়; প্রতিটির নিজস্ব পণ্যের পাতা।
- প্রতিটি পণ্যে "Add to Cart" কাজ করবে; উপরের Cart ব্যাজে সংখ্যা বাড়বে; Cart পাতায় পণ্য, সংখ্যা +/−, মুছে ফেলা, মোট দাম নিজে হিসাব হবে।
- Checkout: Cart → Address → Payment → Review → Place Order → Order Confirmed — আপনার cart-এর আসল পণ্য ও হিসাব দেখাবে।
- Wishlist: হার্ট চাপলে যোগ/বাদ; Wishlist পাতা থেকে Move to Cart।
- Category, Brand, Search, Filter, Sort, ট্যাব — সব বোতামে চাপলে পণ্য বদলাবে।
- Login/Account: দেখানোর জন্য (আসল লগইন নয়); Login চাপলে Account-এ যাবে।
- Cart ও Wishlist ব্রাউজারে মনে থাকবে (রিফ্রেশে হারাবে না)। আসল টাকা বা অর্ডার হবে না।

## কাজের ধাপ
1. পণ্যের তালিকা: সব স্ক্রিনের পণ্য, দাম, সাইজ, ব্র্যান্ড, category এক জায়গায়।
2. Cart ও Wishlist ব্যবস্থা (সব পাতায় শেয়ার)।
3. সাধারণ অংশ আসল কোড দিয়ে: header, সার্চ বার, breadcrumb, নিচের মেনু, পণ্য কার্ড।
4. যেসব স্ক্রিন এখন ছবির টুকরো দিয়ে বানানো (Brands, Johnson's ৩টি, Offers, Order Confirmed, Login, Account, Wishlist, Support, About) — নতুন করে আসল লেখা দিয়ে।
5. বাকি স্ক্রিনের ভেতরের নিষ্ক্রিয় বোতাম সচল করা (category, filter, sort, সাইজ, পরিমাণ)।
6. প্রতিটি পণ্যের জন্য একটি পণ্যের পাতা (Johnson's Shampoo পাতার নকশায়)।
7. Checkout হিসাব cart থেকে।
8. ডেস্কটপ হোম ও Category পাতাও একই cart-এর সাথে যুক্ত।
9. পুরো পথ ব্রাউজারে টেস্ট: হোম → পণ্য → Add to Cart → Checkout → Order Confirmed।

## যা ঠিক রাখা হবে
- মোবাইল ফ্রেম, রং, ফন্ট, মাপ আগের মতোই।
- আসল পেমেন্ট/লগইন/সার্ভার নেই।

## Technical details
- `src/lib/products.ts`: একক static catalog (id, slug, brand, category, price, old, sizes, image)।
- `src/lib/cart-store.tsx`: React context + localStorage (useEffect-এ পড়া, hydration-safe), cart ও wishlist।
- Route `product.$slug.tsx`; পুরনো `product.johnsons-baby-shampoo` → redirect।
- RefScreen ও cropped `ref-*` ছবি সরিয়ে আসল JSX; শুধু পণ্য/ব্যানার/লোগো asset থাকবে।
- Category/brand/search ফিল্টার URL search params-এ।
