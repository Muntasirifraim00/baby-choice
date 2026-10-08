import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/pages/page-shell";
import { FREE_DELIVERY, totals, useCart, type CartLine } from "@/lib/cart-store";
import { getProduct, tk } from "@/lib/products";

/* ---------------- data ---------------- */

export const money = (n: number) => `৳ ${tk(Math.round(n))}`;

/** Saved demo addresses (same as the previous checkout flow). */
export const SAVED_ADDRESSES = [
  { id: "Home", label: "Home", line: "House 25, Road 10, Dhanmondi, Dhaka 1209", phone: "+880 1712 345678", district: "Dhaka", kind: "home", isDefault: true },
  { id: "Office", label: "Office", line: "Level 8, Navana Tower, Gulshan 1, Dhaka 1212", phone: "+880 1712 345678", district: "Dhaka", kind: "work", isDefault: false },
] as const;
export const NEW_ADDRESS = "New address";

const DISTRICTS = ["Dhaka", "Chattogram", "Gazipur", "Narayanganj", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Cumilla"];
const NOTES = ["Call before arriving", "Don't ring the bell, baby sleeping", "Leave with guard", "No lift, please call"];

/** Payment ids are the strings the cart store already uses. */
export const PAYMENTS = [
  { id: "Cash on Delivery", label: "Cash on delivery", sub: "Pay when it arrives", mark: "৳", tile: "#148a5a" },
  { id: "bKash", label: "bKash", sub: "Pay from your bKash account", mark: "bK", tile: "#d2136a" },
  { id: "Nagad", label: "Nagad", sub: "Pay from your Nagad account", mark: "N", tile: "#d9531a" },
  { id: "Credit / Debit Card", label: "Credit / debit card", sub: "Visa, Mastercard, Amex", mark: "Card", tile: "#4c22b8" },
] as const;
export const paymentLabel = (id: string) => PAYMENTS.find(p => p.id === id)?.label ?? id;

const DELIVERY_FEE = 80; // mirrors totals() in cart-store
const DELIVERY_TIME = "Usually 2–4 days across Bangladesh";

/* ---------------- temporary (in-memory only) checkout draft ---------------- */

type Draft = { name: string; phone: string; district: string; area: string; line: string; notes: string[] };
const EMPTY_DRAFT: Draft = { name: "", phone: "", district: "Dhaka", area: "", line: "", notes: [] };
let draft: Draft = EMPTY_DRAFT;
const subs = new Set<() => void>();
const setDraft = (p: Partial<Draft>) => { draft = { ...draft, ...p }; subs.forEach(f => f()); };
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };
/** Checkout form fields live only in memory (never persisted), per AGENTS.md. */
export function useCheckoutDraft() {
  return useSyncExternalStore(subscribe, () => draft, () => EMPTY_DRAFT);
}

const digits = (v: string, n: number) => v.replace(/\D/g, "").slice(0, n);
function draftErrors(d: Draft) {
  return {
    name: d.name.trim().length < 2 ? "Enter the recipient's name" : "",
    phone: d.phone.length !== 10 ? "Enter a 10-digit mobile number" : "",
    area: d.area.trim().length < 2 ? "Enter your area" : "",
    line: d.line.trim().length < 4 ? "Enter house, road and flat" : "",
  };
}
const draftValid = (d: Draft) => Object.values(draftErrors(d)).every(e => !e);

export type ResolvedAddress = { label: string; line: string; phone: string; district: string };
export function resolveAddress(address: string, d: Draft): ResolvedAddress | null {
  const saved = SAVED_ADDRESSES.find(a => a.id === address);
  if (saved) return saved;
  if (address === NEW_ADDRESS && draftValid(d)) return { label: d.name.trim(), line: [d.line.trim(), d.area.trim(), d.district].join(", "), phone: `+880 ${d.phone}`, district: d.district };
  return null;
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* ---------------- icons ---------------- */

const IcBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>;
const IcLock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
export const IcCheck = ({ s = 14 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>;
export const IcTruck = ({ className, w = 26 }: { className?: string; w?: number }) => <svg className={className} width={w} height={w * 20 / 24} viewBox="0 0 24 20" aria-hidden="true"><path d="M1 4h13v10H1zM14 7h4l4 4v3h-8z" fill="url(#hdPink)" /><circle cx="5" cy="16" r="2.4" fill="#2a1650" /><circle cx="17" cy="16" r="2.4" fill="#2a1650" /></svg>;
const IcHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#6d3bea" aria-hidden="true"><path d="M12 3 3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10z" /></svg>;
const IcWork = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#b5541a" aria-hidden="true"><path d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm0 3h6V6H9z" /></svg>;
const IcPin = ({ c = "#f0457a", s = 20 }: { c?: string; s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>;
const IcShield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d3bea" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>;
const IcCal = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b06d00" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
const IcCard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#136b40" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" /></svg>;
const IcSpin = () => <svg className="ck-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9" /></svg>;

/* ---------------- shared pieces ---------------- */

type Step = "address" | "payment" | "review";
const STEPS: { id: Step; label: string; to: "/checkout" | "/checkout/payment" | "/checkout/review" }[] = [
  { id: "address", label: "Address", to: "/checkout" },
  { id: "payment", label: "Payment", to: "/checkout/payment" },
  { id: "review", label: "Review", to: "/checkout/review" },
];

function CheckoutHeader({ step }: { step: Step }) {
  const idx = STEPS.findIndex(s => s.id === step);
  const progress = idx / 2;
  const back = idx === 0 ? { to: "/cart" as const, label: "Back to cart" } : { to: STEPS[idx - 1]!.to, label: `Back to ${STEPS[idx - 1]!.label.toLowerCase()}` };
  return (
    <header className="ck-top">
      <div className="ck-top-row">
        <Link to={back.to} aria-label={back.label} className="ck-ibtn"><IcBack /></Link>
        <div className="ck-top-title">
          <h1>Checkout</h1>
          <p>Step {idx + 1} of 3 · {STEPS[idx]!.label}</p>
        </div>
        <span className="ck-secure"><IcLock />Secure</span>
      </div>
      <nav aria-label="Checkout steps" className="ck-steps" style={{ "--ck-p": progress } as CSSProperties}>
        <span className="ck-track" aria-hidden="true"><span className="ck-fill" /></span>
        <IcTruck className="ck-truck ck-drive" />
        <ol>
          {STEPS.map((s, i) => {
            const done = i < idx, cur = i === idx;
            const inner = <><span className={`ck-dot ${done ? "done" : cur ? "cur" : ""}`}>{done ? <IcCheck /> : i + 1}</span><span className="ck-step-label">{s.label}</span></>;
            return (
              <li key={s.id}>
                {done
                  ? <Link to={s.to} className="ck-step" aria-label={`${s.label} (done) – edit`}>{inner}</Link>
                  : <span className="ck-step" aria-current={cur ? "step" : undefined}>{inner}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

function OrderLines({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="ck-lines">
      {lines.map(l => {
        const p = getProduct(l.slug);
        if (!p) return null;
        return (
          <li key={l.slug + l.size} className="ck-line">
            <span className="ck-line-img"><img src={p.image} alt="" loading="lazy" /><b>×{l.qty}</b></span>
            <span className="ck-line-name">
              <Link to="/product/$slug" params={{ slug: l.slug }}>{p.name}</Link>
              <small>{l.size ? `${l.size} · ` : ""}{l.qty} × {money(p.price)}</small>
            </span>
            <b className="ck-line-price">{money(p.price * l.qty)}</b>
          </li>
        );
      })}
    </ul>
  );
}

export function TotalsBox({ lines, title }: { lines: CartLine[]; title?: string }) {
  const t = totals(lines);
  return (
    <dl className="ck-totals" aria-label={title ?? "Order total"}>
      <div><dt>Items ({t.count})</dt><dd>{money(t.subtotal)}</dd></div>
      {t.discount > 0 && <div><dt>Product discount</dt><dd className="ck-mint">− {money(t.discount)}</dd></div>}
      <div><dt>Delivery</dt><dd className={t.delivery ? "" : "ck-mint"}>{t.delivery ? money(t.delivery) : "FREE"}</dd></div>
      <span className="ck-rule" aria-hidden="true" />
      <div className="ck-grand"><dt>Total</dt><dd>{money(t.total)}</dd></div>
    </dl>
  );
}

function FreeDeliveryMeter({ lines }: { lines: CartLine[] }) {
  const t = totals(lines);
  const left = FREE_DELIVERY - t.net;
  return (
    <div className="ck-meter">
      <p>{left > 0 ? <>Add <b>{money(left)}</b> more for <b>free delivery</b></> : <><b>Free delivery</b> unlocked</>}</p>
      <progress max={FREE_DELIVERY} value={Math.min(FREE_DELIVERY, t.net)} aria-label="Progress to free delivery" />
    </div>
  );
}

export function EmptyCheckout() {
  return (
    <section className="ck-empty">
      <svg width="120" height="104" viewBox="0 0 120 104" aria-hidden="true" className="ck-float">
        <ellipse cx="60" cy="98" rx="40" ry="5" fill="#e9e0f8" />
        <path d="M16 18h12l10 50h52l10-36H34" fill="none" stroke="#6d3bea" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="84" r="7" fill="url(#hdPink)" /><circle cx="84" cy="84" r="7" fill="url(#hdPink)" />
        <path d="M54 44q6 6 12 0" stroke="#2a1650" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="52" cy="38" r="3" fill="#2a1650" /><circle cx="68" cy="38" r="3" fill="#2a1650" />
      </svg>
      <h2>Your cart is empty</h2>
      <p>Add a few goodies for your little one, then come back here to check out.</p>
      <div className="ck-empty-actions">
        <Link to="/" className="ck-btn pink">Start shopping</Link>
        <Link to="/categories" className="ck-btn ghost">Browse categories</Link>
      </div>
    </section>
  );
}

/* ---------------- step 1: address ---------------- */

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: ReactNode }) {
  return (
    <div className={`ck-field ${error ? "bad" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span id={`${id}-err`} className="ck-err">{error}</span>}
    </div>
  );
}

function AddressStep({ choice, onPick, tried, shake, lines }: { choice: string; onPick: (id: string) => void; tried: boolean; shake: number; lines: CartLine[] }) {
  const d = useCheckoutDraft();
  const errs = draftErrors(d);
  const show = (k: keyof typeof errs) => (tried && errs[k] ? errs[k] : undefined);
  const inv = (k: keyof typeof errs) => ({ "aria-invalid": tried && !!errs[k], "aria-describedby": tried && errs[k] ? `ck-${k}-err` : undefined });
  const t = totals(lines);
  const options = [
    ...SAVED_ADDRESSES.map(a => ({ id: a.id, label: a.label, line: a.line, kind: a.kind as string, isDefault: a.isDefault })),
    { id: NEW_ADDRESS, label: "Add a new address", line: d.line && d.area ? `${d.line}, ${d.area}` : "Deliver somewhere else", kind: "new", isDefault: false },
  ];
  return (
    <div className="ck-stepbody ck-in">
      <fieldset className="ck-fs">
        <legend className="ck-h2">Where should we deliver?</legend>
        <div className="ck-radios">
          {options.map(o => {
            const on = o.id === choice;
            return (
              <label key={o.id} className={`ck-opt ${on ? "on" : ""}`}>
                <input type="radio" name="ck-address" value={o.id} checked={on} onChange={() => onPick(o.id)} className="ck-sr" />
                <span className={`ck-tile ${o.kind}`}>{o.kind === "home" ? <IcHome /> : o.kind === "work" ? <IcWork /> : <IcPin />}</span>
                <span className="ck-opt-text">
                  <span className="ck-opt-head"><b>{o.label}</b>{o.isDefault && <span className="ck-pill">Default</span>}</span>
                  <span className="ck-opt-sub">{o.line}</span>
                </span>
                <span className="ck-radio" aria-hidden="true"><span /></span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {choice === NEW_ADDRESS && (
        <div key={shake} className={`ck-card ck-form ck-fadeup ${tried && !draftValid(d) ? "ck-shake" : ""}`}>
          <Field id="ck-name" label="Full name" error={show("name")}>
            <input id="ck-name" type="text" required autoComplete="name" placeholder="Parent's name" value={d.name} onChange={e => setDraft({ name: e.target.value })} {...inv("name")} />
          </Field>
          <Field id="ck-phone" label="Mobile number" error={show("phone")}>
            <span className="ck-phone">
              <span aria-hidden="true">+880</span>
              <input id="ck-phone" type="tel" required inputMode="numeric" autoComplete="tel-national" placeholder="1XXX-XXXXXX" pattern="\d{10}" value={d.phone}
                onChange={e => setDraft({ phone: digits(e.target.value, 10) })} {...inv("phone")} aria-describedby={tried && errs.phone ? "ck-phone-err" : "ck-phone-hint"} />
            </span>
            <span id="ck-phone-hint" className="ck-sr">Bangladesh number after +880, 10 digits</span>
          </Field>
          <div className="ck-pair">
            <Field id="ck-district" label="District">
              <select id="ck-district" required autoComplete="address-level1" value={d.district} onChange={e => setDraft({ district: e.target.value })}>
                {DISTRICTS.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
            <Field id="ck-area" label="Area" error={show("area")}>
              <input id="ck-area" type="text" required autoComplete="address-level2" placeholder="e.g. Dhanmondi" value={d.area} onChange={e => setDraft({ area: e.target.value })} {...inv("area")} />
            </Field>
          </div>
          <Field id="ck-line" label="House, road, flat" error={show("line")}>
            <input id="ck-line" type="text" required autoComplete="address-line1" placeholder="House 12, Road 5, Flat 3B" value={d.line} onChange={e => setDraft({ line: e.target.value })} {...inv("line")} />
          </Field>
        </div>
      )}

      <h2 className="ck-h2 ck-gap">Delivery</h2>
      <div className="ck-card ck-delivery">
        <div className="ck-del-row">
          <span className="ck-tile del"><IcTruck w={24} className="ck-float-sm" /></span>
          <span className="ck-opt-text"><b>Standard home delivery</b><span className="ck-opt-sub">{DELIVERY_TIME}</span></span>
          <b className={`ck-fee ${t.delivery ? "" : "ck-free"}`}>{t.delivery ? money(t.delivery) : "FREE"}</b>
        </div>
        <FreeDeliveryMeter lines={lines} />
        <p className="ck-fine">{money(DELIVERY_FEE)} delivery, free on orders of {money(FREE_DELIVERY)} or more.</p>
      </div>

      <h3 className="ck-h3" id="ck-notes-h">Delivery notes <span>(optional)</span></h3>
      <div className="ck-chips" role="group" aria-labelledby="ck-notes-h">
        {NOTES.map(n => {
          const on = d.notes.includes(n);
          return <button key={n} type="button" aria-pressed={on} className={`ck-chip ${on ? "on" : ""}`} onClick={() => setDraft({ notes: on ? d.notes.filter(x => x !== n) : [...d.notes, n] })}>{n}</button>;
        })}
      </div>
    </div>
  );
}

/* ---------------- step 2: payment ---------------- */

function PaymentStep({ total }: { total: number }) {
  const { payment, setPayment } = useCart();
  const current = PAYMENTS.some(p => p.id === payment) ? payment : PAYMENTS[0].id;
  return (
    <div className="ck-stepbody ck-in">
      <fieldset className="ck-fs">
        <legend className="ck-h2">How would you like to pay?</legend>
        <div className="ck-radios">
          {PAYMENTS.map(p => {
            const on = p.id === current;
            return (
              <div key={p.id} className={`ck-pay ${on ? "on" : ""}`}>
                <label className="ck-opt bare">
                  <input type="radio" name="ck-payment" value={p.id} checked={on} onChange={() => setPayment(p.id)} className="ck-sr" />
                  <span className={`ck-mark ${p.mark === "৳" ? "taka" : ""}`} style={{ background: p.tile }} aria-hidden="true">{p.mark}</span>
                  <span className="ck-opt-text"><b>{p.label}</b><span className="ck-opt-sub">{p.sub}</span></span>
                  <span className="ck-radio" aria-hidden="true"><span /></span>
                </label>
                {on && p.id === "Cash on Delivery" && (
                  <p className="ck-paynote ck-fadeup">Pay in cash when your order arrives. Please keep the exact amount ready: <b>{money(total)}</b></p>
                )}
                {on && (p.id === "bKash" || p.id === "Nagad") && (
                  <p className="ck-paynote ck-fadeup">After you place your order you'd approve <b>{money(total)}</b> in the {p.label} app. This is a demo shop, so no account number is needed and no money is taken.</p>
                )}
                {on && p.id === "Credit / Debit Card" && (
                  <div className="ck-cardwrap ck-fadeup">
                    <div className="ck-cc" aria-hidden="true">
                      <svg className="ck-cc-chip" width="40" height="30" viewBox="0 0 40 30"><rect width="40" height="30" rx="6" fill="url(#hdYellow)" /><path d="M0 10h14M0 20h14M26 10h14M26 20h14M14 0v30M26 0v30" stroke="#d48a12" strokeWidth="1.2" /></svg>
                      <span className="ck-cc-brand">CARD</span>
                      <span className="ck-cc-no">•••• •••• •••• ••••</span>
                      <span className="ck-cc-k"><span>CARD HOLDER</span><span>EXPIRES</span></span>
                      <span className="ck-cc-v"><span>YOUR NAME</span><span>MM/YY</span></span>
                    </div>
                    <p className="ck-paynote flush">Card details would be entered on the bank's secure page after you place the order. This is a demo shop, so nothing is charged.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>
      <p className="ck-safe"><IcShield />We never ask for your PIN or OTP. Demo checkout: no real payment is processed.</p>
    </div>
  );
}

/* ---------------- step 3: review ---------------- */

function ReviewStep({ lines, addr, notes, tried, shake, terms, setTerms }: { lines: CartLine[]; addr: ResolvedAddress | null; notes: string[]; tried: boolean; shake: number; terms: boolean; setTerms: (v: boolean) => void }) {
  const { payment } = useCart();
  const t = totals(lines);
  const sub = payment === "Cash on Delivery" ? `Pay ${money(t.total)} on arrival` : payment === "Credit / Debit Card" ? "Card details on the next page (demo)" : `Approve in the ${paymentLabel(payment)} app (demo)`;
  return (
    <div className="ck-stepbody ck-in">
      <h2 className="ck-h2">One last look</h2>
      <div className="ck-card ck-review">
        <div className="ck-rrow">
          <span className="ck-rtile pin"><IcPin c="#6d3bea" s={18} /></span>
          <div className="ck-opt-text">
            {addr ? <><b>Deliver to {addr.label}</b><span className="ck-opt-sub">{addr.line} · {addr.phone}</span></>
              : <><b>No delivery address yet</b><span className="ck-opt-sub ck-warn">Please add where we should deliver.</span></>}
          </div>
          <Link to="/checkout" className="ck-edit" aria-label="Edit delivery address">Edit</Link>
        </div>
        <span className="ck-sep" aria-hidden="true" />
        <div className="ck-rrow">
          <span className="ck-rtile cal"><IcCal /></span>
          <div className="ck-opt-text"><b>Standard delivery · {t.delivery ? money(t.delivery) : "FREE"}</b><span className="ck-opt-sub">{DELIVERY_TIME}{notes.length ? ` · ${notes.join(" · ")}` : " · No delivery notes"}</span></div>
          <Link to="/checkout" className="ck-edit" aria-label="Edit delivery notes">Edit</Link>
        </div>
        <span className="ck-sep" aria-hidden="true" />
        <div className="ck-rrow">
          <span className="ck-rtile card"><IcCard /></span>
          <div className="ck-opt-text"><b>{paymentLabel(payment)}</b><span className="ck-opt-sub">{sub}</span></div>
          <Link to="/checkout/payment" className="ck-edit" aria-label="Edit payment method">Edit</Link>
        </div>
      </div>

      <div className="ck-phone-only">
        <h3 className="ck-h3">Your items ({lines.length})</h3>
        <OrderLines lines={lines} />
        <TotalsBox lines={lines} />
      </div>

      <label key={shake} className={`ck-terms ${tried && !terms ? "bad ck-shake" : ""}`}>
        <input type="checkbox" required checked={terms} onChange={e => setTerms(e.target.checked)} className="ck-sr" aria-invalid={tried && !terms} aria-describedby={tried && !terms ? "ck-terms-err" : undefined} />
        <span className="ck-box" aria-hidden="true"><IcCheck s={13} /></span>
        <span>I agree to the <Link to="/support">Terms</Link> and <Link to="/support">Return policy</Link></span>
      </label>
      {tried && !terms && <p id="ck-terms-err" className="ck-err">Please accept the terms to place your order.</p>}
    </div>
  );
}

/* ---------------- page ---------------- */

export function CheckoutPage({ step, startNew = false }: { step: Step; startNew?: boolean }) {
  const { lines, address, setAddress, placeOrder } = useCart();
  const navigate = useNavigate();
  const mounted = useMounted();
  const d = useCheckoutDraft();
  const [picked, setPicked] = useState<string | null>(startNew ? NEW_ADDRESS : null);
  const choice = picked ?? address;
  const [tried, setTried] = useState(false);
  const [shake, setShake] = useState(0);
  const [terms, setTerms] = useState(false);
  const [placing, setPlacing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const t = totals(lines);
  const addr = resolveAddress(address, d);
  const ready = step === "address" ? (choice !== NEW_ADDRESS || draftValid(d)) : step === "payment" ? true : terms && !!addr;
  const cta = placing ? "Placing order…" : step === "address" ? "Continue to payment" : step === "payment" ? "Review order" : "Place order";

  const fail = () => { setTried(true); setShake(s => s + 1); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (placing) return;
    if (step === "address") {
      if (choice === NEW_ADDRESS && !draftValid(d)) {
        fail();
        const errs = draftErrors(d);
        const first = (Object.keys(errs) as (keyof typeof errs)[]).find(k => errs[k]);
        if (first) requestAnimationFrame(() => document.getElementById(`ck-${first}`)?.focus());
        return;
      }
      setAddress(choice);
      void navigate({ to: "/checkout/payment" });
      return;
    }
    if (step === "payment") { void navigate({ to: "/checkout/review" }); return; }
    if (!addr) { void navigate({ to: "/checkout" }); return; }
    if (!terms) { fail(); return; }
    setPlacing(true);
    timer.current = setTimeout(() => { placeOrder(); void navigate({ to: "/order-confirmed" }); }, 900);
  };

  let body: ReactNode;
  if (!mounted) body = <div className="ck-loading" aria-busy="true">Loading your cart…</div>;
  else if (lines.length === 0 && !placing) body = <EmptyCheckout />;
  else body = (
    <form className="ck-grid" noValidate onSubmit={submit} aria-label={`Checkout – ${STEPS.find(s => s.id === step)!.label}`}>
      <div className="ck-main">
        {step === "address" && <AddressStep choice={choice} onPick={id => { setPicked(id); setTried(false); if (id !== NEW_ADDRESS) setAddress(id); }} tried={tried} shake={shake} lines={lines} />}
        {step === "payment" && <PaymentStep total={t.total} />}
        {step === "review" && <ReviewStep lines={lines} addr={addr} notes={d.notes} tried={tried} shake={shake} terms={terms} setTerms={setTerms} />}
      </div>

      <aside className="ck-aside" aria-label="Order summary">
        <div className="ck-card ck-sum">
          <div className="ck-sum-head"><h2 className="ck-h3">Order summary</h2><Link to="/cart" className="ck-edit">Edit cart</Link></div>
          <OrderLines lines={lines} />
          <TotalsBox lines={lines} />
          {step !== "review" && <FreeDeliveryMeter lines={lines} />}
          <button type="submit" className={`ck-cta ${ready ? "" : "dim"}`} aria-busy={placing}>{placing && <IcSpin />}{cta}</button>
          <p className="ck-fine center"><IcLock /> Secure demo checkout · no real payment</p>
        </div>
      </aside>

      <div className="ck-bar">
        <div className="ck-bar-total">
          <span>Total</span>
          <b>{money(t.total)}</b>
          <small className={t.delivery ? "" : "ck-free"}>{t.delivery ? `incl. ${money(t.delivery)} delivery` : "Free delivery"}</small>
        </div>
        <button type="submit" className={`ck-cta ${ready ? "" : "dim"}`} aria-busy={placing}>{placing && <IcSpin />}{cta}</button>
      </div>
    </form>
  );

  return (
    <PageShell className="ck">
      <div className="ck-page">
        <div className="ck-wrap">
          <nav aria-label="Breadcrumb" className="ck-crumbs">
            <Link to="/">Home</Link><span aria-hidden="true">›</span>
            <Link to="/cart">Cart</Link><span aria-hidden="true">›</span>
            <span aria-current="page">Checkout</span>
          </nav>
          <CheckoutHeader step={step} />
          {body}
        </div>
      </div>
    </PageShell>
  );
}
