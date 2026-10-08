import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function LvBanner({ title, text, image, cta, to, tone = "" }: { title: ReactNode; text: string; image?: string; cta?: string; to?: string; tone?: string }) {
  return <section className={`lv-banner ${tone}`}><div><h2>{title}</h2><p>{text}</p>{cta && to && <Link to={to as "/"} className="lv-btn">{cta}<ArrowRight /></Link>}</div>{image && <img src={image} alt="" />}</section>;
}
export function LvHead({ title, to, action }: { title: string; to?: string; action?: string }) {
  return <div className="lv-section-head"><h2>{title}</h2>{to && <Link to={to as "/"}>{action ?? "View All"}<ArrowRight /></Link>}</div>;
}
export function Tile({ icon, title, text, to, href, onClick }: { icon: ReactNode; title: string; text?: string; to?: string; href?: string; onClick?: () => void }) {
  const inner = <><i>{icon}</i><b>{title}</b>{text && <small>{text}</small>}</>;
  if (to) return <Link to={to as "/"} className="lv-tile">{inner}</Link>;
  if (href) return <a href={href} className="lv-tile" target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a>;
  if (onClick) return <button type="button" className="lv-tile" onClick={onClick}>{inner}</button>;
  return <div className="lv-tile">{inner}</div>;
}
