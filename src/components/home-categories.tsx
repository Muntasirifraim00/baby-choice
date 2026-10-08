import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeCategories } from "@/lib/home-categories";
import { getProduct } from "@/lib/products";

const artwork = ["carters-girl-bodysuit-set", "girl-pajama-set", "girl-party-dress-bow", "baby-hooded-towel", "aptamil-advance-follow-on-milk", "johnsons-baby-lotion", "baby-stroller", "baby-high-chair"];
const tones = ["pink", "lilac", "rose", "peach", "sky", "mint", "teal", "lemon"];

export function HomeCategorySection() {
  return <section className="categories-section home-category-section" aria-label="Shop By Category">
    <div className="section-heading"><h2>Shop By Category</h2><Button asChild variant="ghost" className="demo-button section-action"><Link to="/categories">View All Categories<ArrowRight /></Link></Button></div>
    <div className="category-grid">{homeCategories.map((category, index) => <Button asChild variant="ghost" key={category.slug} className={`demo-button category-card tone-${tones[index]}`}>
      <Link to="/categories/$cat" params={{ cat: category.slug }} aria-label={category.name}>
        <span className="category-art"><img src={getProduct(artwork[index] ?? "")?.image} alt="" /></span>
        <span className="category-name">{category.name}</span>
        <span className="category-explore">Shop Now<ChevronRight /></span>
      </Link>
    </Button>)}</div>
  </section>;
}