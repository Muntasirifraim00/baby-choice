import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/live-head";
import b1 from "@/assets/brand-1.png.asset.json";
import b2 from "@/assets/brand-2.png.asset.json";
import b3 from "@/assets/brand-3.png.asset.json";
import b4 from "@/assets/brand-4.png.asset.json";
import b5 from "@/assets/brand-5.png.asset.json";
import b6 from "@/assets/brand-6.png.asset.json";
import b7 from "@/assets/brand-7.png.asset.json";

const brands = [[b1, "Aptamil"], [b2, "Nestlé"], [b3, "Sudocrem"], [b4, "Pampers"], [b5, "Carter's"], [b6, "Johnson's"], [b7, "Philips Avent"]] as const;

export function HomeBrands() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || engaged || focused || reduced) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive(value => (value + 1) % brands.length); }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, engaged, focused, reduced]);
  const move = (delta: number) => setActive(value => (value + delta + brands.length) % brands.length);
  return <section className="brands-section home-brands" aria-label="Top Brands" aria-roledescription="carousel"
    onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="section-heading"><h2>Top Brands</h2><Button asChild variant="ghost" className="demo-button section-action"><Link to="/brands">View All Brands<ArrowRight /></Link></Button></div>
    <div className="hb-window">
      {brands.map((_, page) => <div className="hb-grid" key={page} data-active={active === page} aria-hidden={active !== page} inert={active !== page}>
        {Array.from({ length: 6 }, (_, offset) => {
          const brand = brands[(page + offset) % brands.length];
          if (!brand) return null;
          const [image, name] = brand;
          return <Button asChild variant="ghost" className="demo-button hb-card" key={name}>
            <Link to="/brands/$brand" params={{ brand: slugify(name) }} aria-label={`Shop ${name}`}><img src={image.url} alt={name} /><span>{name}<ArrowRight /></span></Link>
          </Button>;
        })}
      </div>)}
    </div>
    <div className="hb-controls">
      <Button variant="ghost" className="hb-control" aria-label="Previous brands" onClick={() => move(-1)}><ChevronLeft /></Button>
      <div className="hb-dots">{brands.map(([, name], page) => <Button key={name} variant="ghost" className="hb-dot" aria-label={`Show brands starting with ${name}`} aria-pressed={active === page} onClick={() => setActive(page)} />)}</div>
      <Button variant="ghost" className="hb-control" aria-label="Next brands" onClick={() => move(1)}><ChevronRight /></Button>
      <Button variant="ghost" className="hb-control" aria-label={paused ? "Play brands" : "Pause brands"} onClick={() => setPaused(value => !value)}>{paused ? <Play /> : <Pause />}</Button>
    </div>
  </section>;
}