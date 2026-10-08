import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import choice from "@/assets/home-choice.png.asset.json";
import clothing from "@/assets/home-clothing.png.asset.json";
import diapers from "@/assets/home-diapers.png.asset.json";
import health from "@/assets/home-health.png.asset.json";
import toys from "@/assets/home-toys.png.asset.json";
import feeding from "@/assets/home-feeding.png.asset.json";

const groups = [
  [{ image: choice, label: "Baby Choice", cat: "" }, { image: clothing, label: "Baby Clothing", cat: "baby-clothing" }, { image: diapers, label: "Diapers & Wipes", cat: "diapers-and-wipes" }],
  [{ image: health, label: "Health & Safety", cat: "health-and-safety" }, { image: toys, label: "Toys & Learning", cat: "toys-and-learning" }, { image: feeding, label: "Baby Feeding", cat: "feeding-and-nursing" }],
];

function BannerSlider({ slides, row }: { slides: typeof groups[number]; row: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(value => (value + 1) % slides.length);
    }, row === 0 ? 5000 : 5700);
    return () => window.clearInterval(timer);
  }, [active, paused, hovered, focused, reduced, row, slides.length]);
  return <section className="home-banner-slider" aria-label={`Homepage banner ${row + 1}`} aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); setActive(value => (value + (event.key === "ArrowRight" ? 1 : slides.length - 1)) % slides.length); } }}>
    <div className="home-banner-window" onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={event => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 35) setActive(value => (value + (end < (touchStart.current ?? end) ? 1 : slides.length - 1)) % slides.length);
        touchStart.current = null;
      }}>
      {slides.map((slide, index) => <div key={slide.label} className="home-banner-slide" data-position={index === active ? "active" : index === (active + 1) % slides.length ? "next" : "previous"} aria-hidden={index !== active} inert={index !== active}>
        <Button asChild variant="ghost" className="demo-button home-banner-link">
          {slide.cat ? <Link to="/categories/$cat" params={{ cat: slide.cat }} aria-label={`Shop ${slide.label}`} tabIndex={index === active ? 0 : -1}><img src={slide.image.url} alt={`${slide.label} — Shop Now`} width={1846} height={768} loading={index === 0 ? "eager" : "lazy"} /></Link>
            : <Link to="/trending" aria-label="Shop Baby Choice" tabIndex={index === active ? 0 : -1}><img src={slide.image.url} alt="Baby Choice — Everything for Your Little One. Shop Now." width={1860} height={768} loading="eager" /></Link>}
        </Button>
      </div>)}
    </div>
    <div className="home-banner-controls"><div className="home-banner-dots">{slides.map((slide, index) => <Button key={slide.label} variant="ghost" className="demo-button home-banner-dot" aria-label={`Show ${slide.label} banner`} aria-pressed={active === index} onClick={() => setActive(index)} />)}</div>
      {!reduced && <Button variant="ghost" className="demo-button home-banner-pause" aria-label={`${paused ? "Play" : "Pause"} banner ${row + 1}`} onClick={() => setPaused(value => !value)}>{paused ? <Play /> : <Pause />}</Button>}
    </div>
  </section>;
}

export function HomeBanners() {
  return <div className="home-banners">{groups.map((slides, row) => <BannerSlider key={row} slides={slides} row={row} />)}</div>;
}