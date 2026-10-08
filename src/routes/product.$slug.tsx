import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductPage as ProductView } from "@/components/pages/product-page";
import { getProduct, tk } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => { const product = getProduct(params.slug); if (!product) throw notFound(); return { product }; },
  head: ({ loaderData }) => {
    const x = loaderData?.product;
    const title = x ? `${x.name} — Baby Choice` : "Product not found — Baby Choice";
    const description = x ? `Explore ${x.name}, available sizes and product details at Baby Choice. From ৳${tk(x.price)}.` : "Find baby products at Baby Choice.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <div className="mobile-frame"><main className="baby-screen"><div className="lv-empty"><h1>Product not found</h1><Link to="/">Back to Home</Link></div></main></div>,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return <ProductView key={product.slug} product={product} />;
}
