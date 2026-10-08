/** Runs only after an explicit browser cart-add interaction. */
export function flyToCart(source?: HTMLElement) {
  if (typeof document === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visible = (element: Element) => {
    const r = element.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
  };
  const origin = source ?? (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
  if (!origin) return;
  let target = Array.from(document.querySelectorAll('a[href="/cart"]')).find(visible);
  let dock: HTMLAnchorElement | undefined;
  if (!target) {
    dock = document.createElement("a");
    dock.href = "/cart";
    dock.className = "cart-flight-dock";
    dock.setAttribute("aria-label", "View shopping cart");
    const icon = document.querySelector('a[href="/cart"] svg')?.cloneNode(true);
    if (icon) dock.appendChild(icon);
    document.body.appendChild(dock);
    target = dock;
  }
  const destination = target;
  const pulse = () => {
    if (!reduced) destination.animate([
      { transform: "scale(1)" }, { transform: "scale(1.23)" }, { transform: "scale(.94)" }, { transform: "scale(1)" },
    ], { duration: 430, easing: "ease-out" });
    if (dock) window.setTimeout(() => dock?.remove(), 900);
  };
  if (reduced) { pulse(); return; }
  const start = origin.getBoundingClientRect();
  const end = destination.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "cart-flying-dot";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  const sx = start.left + start.width / 2 - 7;
  const sy = start.top + start.height / 2 - 7;
  const ex = end.left + end.width / 2 - 7;
  const ey = end.top + end.height / 2 - 7;
  const flight = dot.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(1)`, opacity: 1 },
    { transform: `translate(${sx + (ex - sx) * .25}px, ${Math.min(sy, ey) - 65}px) scale(1.5)`, opacity: 1, offset: .45 },
    { transform: `translate(${ex}px, ${ey}px) scale(.35)`, opacity: .7 },
  ], { duration: 780, easing: "cubic-bezier(.3,.05,.55,1)", fill: "forwards" });
  flight.finished.then(() => { dot.remove(); pulse(); }).catch(() => { dot.remove(); dock?.remove(); });
}