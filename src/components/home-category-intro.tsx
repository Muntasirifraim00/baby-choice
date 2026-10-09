import { Link } from "@tanstack/react-router";
import type { homeCategoryIntros } from "@/lib/home-category-intros";

export function HomeCategoryIntro({ intro, className }: { intro: (typeof homeCategoryIntros)[number]; className: string }) {
  return (
    <Link to="/categories/$cat" params={{ cat: intro.cat }} className={className} aria-label={`Shop all ${intro.title}`}>
      <picture>
        <source media="(min-width: 900px)" srcSet={intro.desktop} />
        <img src={intro.phone} alt={`${intro.title} — shop all`} loading="lazy" />
      </picture>
    </Link>
  );
}