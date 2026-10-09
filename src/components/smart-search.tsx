import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { tk, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useBumpKey } from "@/lib/motion";
import {
  search, suggest, categoryCounts, highlight, displayName, readRecent, saveRecent, clearRecent,
  POPULAR_SEARCHES, AGE_TILES, STAGE_KEY, popularNow, TINTS, SCOPES, scopeOf,
} from "@/lib/search";

export const SUPPORT_PHONE = "+880 1712 345678";

/* ------------------------------------------------------------ icons */
const I = {
  search: (s: number, w: number, c = "#6d3bea") => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  mic: (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  cam: (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>,
  clock: (s: number, w: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#8a7aa8" strokeWidth={w} strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  up: (s: number) => <svg className="ss-up" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M7 14l5-5 5 5" /></svg>,
  plus: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>,
  bulb: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b06d00" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b3a6cf" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>,
  cart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></svg>,
};

const Hl = ({ text, q }: { text: string; q: string }) => {
  const h = highlight(text, q);
  return <>{h.pre}{h.hit && <mark>{h.hit}</mark>}{h.post}</>;
};

/* ------------------------------------------------------------ shared hooks */
function useSmartQuery(q: string) {
  const [dq, setDq] = useState(q);
  useEffect(() => {
    const t = window.setTimeout(() => setDq(q), 150);
    return () => window.clearTimeout(t);
  }, [q]);
  const data = useMemo(() => {
    const r = search(dq);
    return { ...r, sugg: suggest(dq), cats: categoryCounts(r.results) };
  }, [dq]);
  return { ...data, dq, pending: q.trim() !== "" && q !== dq };
}

function useRecent() {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(readRecent()), []);
  return {
    recent,
    save: (q: string) => setRecent(saveRecent(q)),
    clear: () => { clearRecent(); setRecent([]); },
  };
}

type SR = { lang: string; interimResults: boolean; continuous: boolean; onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void };
const LANG_KEY = "bc-voice-lang";

function useVoice(onText: (t: string) => void, onFinal: (t: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLangState] = useState<"en-US" | "bn-BD">("en-US");
  const rec = useRef<SR | null>(null);
  const silence = useRef<number | undefined>(undefined);
  const cb = useRef({ onText, onFinal });
  cb.current = { onText, onFinal };
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    try { if (localStorage.getItem(LANG_KEY) === "bn-BD") setLangState("bn-BD"); } catch { /* storage unavailable */ }
  }, []);
  const stop = useCallback(() => {
    window.clearTimeout(silence.current);
    try { rec.current?.stop(); } catch { /* already stopped */ }
    rec.current = null;
    setListening(false);
  }, []);
  const arm = useCallback(() => {
    window.clearTimeout(silence.current);
    silence.current = window.setTimeout(stop, 8000);
  }, [stop]);
  const start = useCallback((l = lang) => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const C = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!C) return;
    try { rec.current?.abort(); } catch { /* ignore */ }
    const r = new C();
    r.lang = l;
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      arm();
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i]!;
        text += res[0].transcript;
        if (res.isFinal) final = true;
      }
      cb.current.onText(text);
      if (final) { cb.current.onFinal(text); stop(); }
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("Microphone access was blocked — allow it in your browser settings, or type instead.");
      else if (e.error !== "aborted" && e.error !== "no-speech") setError("Voice search stopped — please try again or type instead.");
      stop();
    };
    r.onend = () => { setListening(false); window.clearTimeout(silence.current); };
    rec.current = r;
    setError("");
    setListening(true);
    arm();
    try { r.start(); } catch { stop(); }
  }, [lang, arm, stop]);
  useEffect(() => () => { window.clearTimeout(silence.current); try { rec.current?.abort(); } catch { /* ignore */ } }, []);
  const setLang = (l: "en-US" | "bn-BD") => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* storage unavailable */ }
    if (listening) start(l);
  };
  return { supported, listening, error, lang, setLang, start: () => start(), stop, toggle: () => (listening ? stop() : start()) };
}

function usePhoto() {
  const [url, setUrl] = useState("");
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return { url, pick: (f?: File | null) => { if (f && f.type.startsWith("image/")) setUrl(URL.createObjectURL(f)); }, reset: () => setUrl("") };
}

const PhotoMessage = ({ url }: { url: string }) => (
  <div className="ss-photo-msg" role="status">
    <img src={url} alt="Your chosen photo" />
    <p>Photo search is coming soon — for now, type the brand or call us at <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>{SUPPORT_PHONE}</a>.</p>
  </div>
);

function useGoStage() {
  const navigate = useNavigate();
  return (id: string) => {
    try { localStorage.setItem(STAGE_KEY, id); } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent("bc-stage", { detail: id }));
    void navigate({ to: "/", hash: "picks" }).then(() => {
      window.setTimeout(() => document.getElementById("picks")?.scrollIntoView({ block: "start" }), 60);
    });
  };
}

const NoResults = ({ q, onPick, center }: { q: string; onPick: (s: string) => void; center?: boolean }) => (
  <div className={`ss-none${center ? " ss-none-c" : ""}`}>
    <b>No products for “{q}” yet</b>
    <p>Check the spelling, or try one of these:</p>
    <div className="ss-chips">{["diapers", "formula", "baby wipes", "rattles"].map((s) => <button type="button" key={s} className="ss-chip" onClick={() => onPick(s)}>{s}</button>)}</div>
    <Link to="/support" className="ss-ask">Ask us to stock it</Link>
  </div>
);

const Corrected = ({ term, typed }: { term: string; typed: string }) => (
  <p className="ss-corr">Showing results for “<b>{term}</b>” · you typed “<span className="bn">{typed.trim()}</span>”</p>
);

const Wave = ({ n }: { n: number }) => <div className="ss-wave" aria-hidden="true">{Array.from({ length: n }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />)}</div>;

const LangToggle = ({ lang, setLang }: { lang: string; setLang: (l: "en-US" | "bn-BD") => void }) => (
  <div className="ss-lang" role="group" aria-label="Voice language">
    <button type="button" aria-pressed={lang === "en-US"} onClick={() => setLang("en-US")}>English</button>
    <button type="button" aria-pressed={lang === "bn-BD"} className="bn" onClick={() => setLang("bn-BD")}>বাংলা</button>
  </div>
);

/* ============================================================ DESKTOP */
export function DesktopSmartSearch({ placeholder }: { placeholder: string }) {
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });
  const { add } = useCart();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "photo">("text");
  const [active, setActive] = useState(-1);
  const [box, setBox] = useState({ left: 0, top: 0, width: 900, dim: 0 });
  const ring = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId().replace(/:/g, "");
  const listId = `ss-list-${uid}`;
  const { recent, save, clear } = useRecent();
  const data = useSmartQuery(q);
  const photo = usePhoto();
  const goStage = useGoStage();
  const voice = useVoice((t) => setQ(t), (t) => { setQ(t); setMode("text"); });

  const has = q.trim() !== "";
  const prods = data.results.slice(0, 6);
  const options = has && !data.pending ? [...data.sugg.map((s) => ({ kind: "s" as const, s })), ...prods.map((p) => ({ kind: "p" as const, p }))] : [];

  const close = useCallback(() => { setOpen(false); setActive(-1); setMode("text"); voice.stop(); photo.reset(); }, [voice, photo]);
  useEffect(() => { setOpen(false); setActive(-1); setMode("text"); }, [href]);
  useEffect(() => setActive(-1), [data.dq]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = ring.current?.getBoundingClientRect();
      const header = ring.current?.closest("header")?.getBoundingClientRect();
      if (!r) return;
      const vw = document.documentElement.clientWidth;
      const width = Math.min(900, vw - 48);
      const left = Math.max(24, Math.min(r.left, vw - 24 - width));
      setBox({ left, top: r.bottom + 4, width, dim: header ? header.bottom : r.bottom + 8 });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ring.current?.contains(t) && !panel.current?.contains(t)) close();
    };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open, close]);

  const go = (term: string) => {
    const c = term.trim();
    if (c) save(c);
    close();
    input.current?.blur();
    void navigate({ to: "/search", search: { q: c } });
  };
  const openProduct = (p: Product) => {
    if (q.trim()) save(q);
    close();
    void navigate({ to: "/product/$slug", params: { slug: p.slug } });
  };
  const submit = (e: FormEvent) => { e.preventDefault(); go(q); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { if (voice.listening) voice.stop(); else close(); e.preventDefault(); return; }
    if (!options.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? options.length - 1 : a - 1)); }
    else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      const o = options[active]!;
      if (o.kind === "s") go(o.s); else openProduct(o.p);
    }
  };
  const optId = (i: number) => `${listId}-o${i}`;

  let body: ReactNode;
  if (voice.listening || voice.error) {
    body = (
      <div className="ss-voice">
        {voice.listening ? <><Wave n={14} /><b className="ss-voice-t">Listening… <span className="bn">বলুন</span></b><p className="ss-tip-s">Say a product or brand, like “Pampers diapers” or <span className="bn">“ডায়াপার”</span>.</p></> : <p className="ss-err" role="alert">{voice.error}</p>}
        <LangToggle lang={voice.lang} setLang={voice.setLang} />
      </div>
    );
  } else if (mode === "photo") {
    body = (
      <div className="ss-photo">
        {photo.url ? <PhotoMessage url={photo.url} /> : (
          <label className="ss-drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); photo.pick(e.dataTransfer.files[0]); }}>
            <input type="file" accept="image/*" className="hm-sr" onChange={(e) => photo.pick(e.target.files?.[0])} />
            <span className="ss-drop-ico">{I.cam(26)}</span>
            <b>Drop a photo of the product, or click to choose one</b>
          </label>
        )}
        <ul className="ss-checks">
          <li>✓ Show the front of the pack or the brand name</li>
          <li>✓ JPG or PNG from your phone or computer</li>
          <li>✓ Your photo stays on this device</li>
        </ul>
      </div>
    );
  } else if (!has) {
    body = (
      <>
        <div className="ss-grid2">
          <div className="ss-col">
            <section>
              <div className="ss-head"><span className="ss-eb">RECENT SEARCHES</span>{recent.length > 0 && <button type="button" className="ss-clear" onClick={clear}>Clear</button>}</div>
              {recent.length ? <div className="ss-chips">{recent.map((s) => <button type="button" key={s} className="ss-chip" onClick={() => go(s)}>{I.clock(14, 2.4)}{s}</button>)}</div> : <p className="ss-muted">Your searches will show here.</p>}
            </section>
            <section>
              <span className="ss-eb">POPULAR SEARCHES</span>
              <div className="ss-rows">{POPULAR_SEARCHES.map((s, i) => <button type="button" key={s} className="ss-row" onClick={() => go(s)}><span className="ss-rk">{i + 1}</span><span className="ss-grow">{s}</span>{I.up(16)}</button>)}</div>
            </section>
          </div>
          <div className="ss-col">
            <section>
              <span className="ss-eb">SHOP BY BABY’S AGE</span>
              <div className="ss-ages">{AGE_TILES.map((a) => <button type="button" key={a.id} style={{ background: a.bg }} onClick={() => { close(); goStage(a.id); }}><b className="ss-bl">{a.label}</b><small>{a.sub}</small></button>)}</div>
            </section>
            <section>
              <span className="ss-eb">POPULAR RIGHT NOW</span>
              <div className="ss-pops">{popularNow().map((p, i) => (
                <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="ss-card ss-card-pop" style={{ animationDelay: `${i * 70}ms` }} onClick={close}>
                  <span className="ss-art" style={{ background: TINTS[[0, 2, 0][i] ?? 0], flexBasis: 52, height: 52 }}><img src={p.image} alt="" /></span>
                  <span className="ss-grow0"><b className="ss-pname">{displayName(p)}</b><small className="ss-rate">★ {p.rating} <span>· {p.reviews} reviews</span></small></span>
                  <b className="ss-bl ss-price">৳ {tk(p.price)}</b>
                </Link>
              ))}</div>
            </section>
          </div>
        </div>
        <div className="ss-tip">{I.bulb}<span>Try “diapers size M”, <span className="bn">“ডায়াপার”</span>, “aptamil 2” — or tap the mic and just say it.</span></div>
      </>
    );
  } else if (data.pending) {
    body = (
      <div className="ss-sk-grid" aria-hidden="true">
        <div>{[0, 1, 2].map((i) => <div key={i} className="ss-sk" style={{ height: 34, marginBottom: 8 }} />)}</div>
        <div className="ss-sk-cards">{[0, 1, 2, 3].map((i) => <div key={i} className="ss-sk" style={{ height: 80 }} />)}</div>
      </div>
    );
  } else if (!data.results.length) {
    body = <NoResults q={q.trim()} onPick={(s) => { setQ(s); input.current?.focus(); }} />;
  } else {
    body = (
      <>
        {data.corrected && <Corrected term={data.corrected} typed={data.typed} />}
        <div className="ss-res">
          <div>
            {data.sugg.length > 0 && <span className="ss-eb">SUGGESTIONS</span>}
            <div className="ss-rows">{data.sugg.map((s, i) => (
              <button type="button" key={s} id={optId(i)} role="option" aria-selected={active === i} className={`ss-row${active === i ? " act" : ""}`} onClick={() => go(s)}>
                {I.search(15, 2.6, "#8a7aa8")}<span className="ss-grow"><Hl text={s} q={data.query} /></span>
              </button>
            ))}</div>
            <span className="ss-eb" style={{ display: "block", marginTop: 14 }}>IN CATEGORIES</span>
            <div className="ss-chips">{data.cats.map((c) => <Link key={c.slug} to="/categories/$cat" params={{ cat: c.slug }} className="ss-chip" style={{ background: c.tint }} onClick={close}>{c.name} <small>{c.count}</small></Link>)}</div>
          </div>
          <div>
            <div className="ss-head ss-head-b"><span className="ss-eb">PRODUCTS</span><span className="ss-count">{data.results.length > 6 ? `6 of ${data.results.length}` : `${data.results.length} products`}</span></div>
            <div className="ss-cards">{prods.map((p, k) => {
              const i = data.sugg.length + k;
              return (
                <article key={p.slug} id={optId(i)} role="option" aria-selected={active === i} className={`ss-card${active === i ? " act" : ""}`} style={{ animationDelay: `${k * 60}ms` }}>
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="ss-art" style={{ background: TINTS[k % 6] }} onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true"><img src={p.image} alt="" /></Link>
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="ss-grow0 ss-plink" onClick={(e) => { e.preventDefault(); openProduct(p); }}>
                    <small className="ss-brand">{p.brand.toUpperCase().replace("'", "’")}</small>
                    <b className="ss-pname"><Hl text={displayName(p)} q={data.query} /></b>
                    <span className="ss-prices"><b className="ss-bl ss-price">৳ {tk(p.price)}</b>{p.old > p.price && <s>৳ {tk(p.old)}</s>}<small>★ {p.rating}</small></span>
                  </Link>
                  <button type="button" className="ss-add" aria-label={`Add ${displayName(p)} to cart`} onClick={(e) => add(p, p.sizes[0] ?? "", 1, e.currentTarget)}>{I.plus}</button>
                </article>
              );
            })}</div>
            <Link to="/search" search={{ q: q.trim() }} className="ss-all" onClick={() => { save(q); close(); }}>See all {data.results.length} results for “{q.trim()}” →</Link>
          </div>
        </div>
        <div className="ss-hint"><span>↑ ↓ to move</span><span>Enter to open</span><span>Esc to close</span></div>
      </>
    );
  }

  return (
    <>
      <div ref={ring} className={`ss-ring${open ? " on" : ""}`}>
        <form role="search" className="hm-search ss-field" onSubmit={submit}>
          {I.search(20, 2.5)}
          <label htmlFor={`ss-in-${uid}`} className="hm-sr">Search products</label>
          <input
            ref={input}
            id={`ss-in-${uid}`}
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? optId(active) : undefined}
            value={q}
            placeholder={open ? "Search diapers, formula, brands… or ডায়াপার" : placeholder}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setMode("text"); }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={onKey}
          />
          {voice.supported && <button type="button" className={`ss-ico${voice.listening ? " live" : ""}`} aria-label="Search by voice" aria-pressed={voice.listening} onClick={() => { setOpen(true); setMode("text"); voice.toggle(); }}>{I.mic(19)}</button>}
          <button type="button" className="ss-ico" aria-label="Search by photo" aria-pressed={mode === "photo"} onClick={() => { voice.stop(); setOpen(true); setMode(mode === "photo" ? "text" : "photo"); }}>{I.cam(19)}</button>
          <button type="submit" className="hm-search-btn">Search</button>
        </form>
      </div>
      {open && typeof document !== "undefined" && createPortal(
        <div className="ss-root">
          <div className="ss-dim" style={{ top: box.dim }} onClick={close} aria-hidden="true" />
          <div ref={panel} id={listId} className="ss-panel" role="listbox" aria-label="Search suggestions" style={{ left: box.left, top: box.top, width: box.width }}>{body}</div>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ============================================================ MOBILE */
export function MobileSearchSheet({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { add, lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const bump = useBumpKey(count);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<string>("All");
  const [sheet, setSheet] = useState<"voice" | "photo" | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const { recent, save, clear } = useRecent();
  const data = useSmartQuery(q);
  const photo = usePhoto();
  const goStage = useGoStage();
  const voice = useVoice((t) => setQ(t), (t) => { setQ(t); setSheet(null); });
  const closedByPop = useRef(false);
  const href = useRouterState({ select: (s) => s.location.href });
  const startHref = useRef(href);

  useEffect(() => {
    window.history.pushState({ ...(window.history.state ?? {}), bcSearchSheet: 1 }, "");
    const pop = () => { closedByPop.current = true; onClose(); };
    window.addEventListener("popstate", pop);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => input.current?.focus(), 50);
    return () => { window.removeEventListener("popstate", pop); document.body.style.overflow = prev; };
  }, [onClose]);
  useEffect(() => { if (href !== startHref.current) onClose(); }, [href, onClose]);

  const back = () => { voice.stop(); if (window.history.state?.bcSearchSheet) window.history.back(); else onClose(); };
  const leave = (fn: () => void) => { voice.stop(); fn(); onClose(); };
  const go = (term: string) => { const c = term.trim(); if (c) save(c); leave(() => void navigate({ to: "/search", search: { q: c } })); };

  const has = q.trim() !== "";
  const scoped = scope === "All" ? data.results : data.results.filter((p) => scopeOf(p) === scope);
  const rows = scoped.slice(0, 5);

  let body: ReactNode;
  if (!has) {
    body = (
      <>
        <section>
          <div className="ss-head"><span className="ss-m-eb">RECENT</span>{recent.length > 0 && <button type="button" className="ss-clear ss-m-clear" onClick={clear}>Clear</button>}</div>
          {recent.length ? <div className="ss-m-chips">{recent.map((s) => <button type="button" key={s} className="ss-m-chip" onClick={() => go(s)}>{I.clock(12, 2.6)}{s}</button>)}</div> : <p className="ss-muted">Your searches will show here.</p>}
        </section>
        <section>
          <span className="ss-m-eb">POPULAR SEARCHES</span>
          <div className="ss-m-card">{POPULAR_SEARCHES.map((s, i) => <button type="button" key={s} className="ss-m-row" onClick={() => go(s)}><span className="ss-m-rk">{i + 1}</span><span className="ss-grow">{s}</span>{I.up(14)}</button>)}</div>
        </section>
        <section>
          <span className="ss-m-eb">SHOP BY BABY’S AGE</span>
          <div className="ss-m-ages">{AGE_TILES.map((a) => <button type="button" key={a.id} style={{ background: a.bg }} onClick={() => leave(() => goStage(a.id))}><b className="ss-bl">{a.label}</b><small>{a.sub}</small></button>)}</div>
        </section>
        <div className="ss-m-tip">Try <span className="bn">“ডায়াপার”</span>, “aptamil 2” or tap the mic and say it.</div>
      </>
    );
  } else if (data.pending) {
    body = <div aria-hidden="true">{[0, 1, 2, 3].map((i) => <div key={i} className="ss-sk ss-m-sk" style={{ height: i ? 72 : 120 }} />)}</div>;
  } else if (!scoped.length) {
    body = data.results.length ? <p className="ss-muted ss-center">No “{q.trim()}” products in {scope}. <button type="button" className="ss-clear" onClick={() => setScope("All")}>Show all</button></p> : <NoResults center q={q.trim()} onPick={(s) => setQ(s)} />;
  } else {
    body = (
      <>
        {data.corrected && <Corrected term={data.corrected} typed={data.typed} />}
        {data.sugg.length > 0 && <div className="ss-m-sugg">{data.sugg.map((s) => <button type="button" key={s} className="ss-m-row" onClick={() => { setQ(s); input.current?.focus(); }}>{I.search(14, 2.6, "#8a7aa8")}<span className="ss-grow"><Hl text={s} q={data.query} /></span>{I.arrow}</button>)}</div>}
        <div className="ss-head ss-head-b"><span className="ss-m-eb">PRODUCTS</span><span className="ss-m-count">{scope === "All" ? `${rows.length} of ${scoped.length}` : `in ${scope} · ${scoped.length} products`}</span></div>
        <div className="ss-m-items">{rows.map((p, k) => (
          <article key={p.slug} className="ss-m-item" style={{ animationDelay: `${k * 60}ms` }}>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="ss-art ss-m-art" style={{ background: TINTS[k % 6] }} onClick={() => save(q)} tabIndex={-1} aria-hidden="true"><img src={p.image} alt="" /></Link>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="ss-grow0 ss-plink" onClick={() => save(q)}>
              <small className="ss-brand ss-m-brand">{p.brand.toUpperCase().replace("'", "’")}</small>
              <b className="ss-pname ss-m-pname"><Hl text={displayName(p)} q={data.query} /></b>
              <span className="ss-prices ss-m-prices"><b className="ss-bl ss-price">৳ {tk(p.price)}</b>{p.old > p.price && <s>৳ {tk(p.old)}</s>}<small>★ {p.rating}</small></span>
            </Link>
            <button type="button" className="ss-add ss-m-add" aria-label={`Add ${displayName(p)} to cart`} onClick={(e) => add(p, p.sizes[0] ?? "", 1, e.currentTarget)}>{I.plus}</button>
          </article>
        ))}</div>
      </>
    );
  }

  return createPortal(
    <div className="ss-m-root" role="dialog" aria-modal="true" aria-label="Search">
      <header className="ss-m-header">
        <div className="ss-m-top">
          <button type="button" className="ss-m-back" aria-label="Close search" onClick={back}>{I.back}</button>
          <div className="ss-m-ring">
            <form role="search" className="ss-m-field" onSubmit={(e) => { e.preventDefault(); go(q); }}>
              {I.search(16, 2.6)}
              <label htmlFor="ss-mq" className="hm-sr">Search products</label>
              <input ref={input} id="ss-mq" type="search" autoComplete="off" enterKeyHint="search" placeholder="Search or say it…" value={q} onChange={(e) => setQ(e.target.value)} />
              {has && <button type="button" className="ss-m-ib" aria-label="Clear text" style={{ color: "#8a7aa8" }} onClick={() => { setQ(""); input.current?.focus(); }}>{I.x}</button>}
              {voice.supported && <button type="button" className={`ss-m-ib${voice.listening ? " live" : ""}`} aria-label="Search by voice" onClick={() => { setSheet("voice"); voice.start(); }}>{I.mic(18)}</button>}
              <button type="button" className="ss-m-ib" aria-label="Search by photo" onClick={() => { photo.reset(); setSheet("photo"); }}>{I.cam(18)}</button>
            </form>
          </div>
          <Link to="/cart" className="ss-m-cart" aria-label={`Cart, ${count} items`} onClick={() => onClose()}>{I.cart}<span key={bump} className={`ss-m-cnt${bump ? " ss-bump" : ""}`}>{count}</span></Link>
        </div>
        <nav aria-label="Search in" className="ss-m-scopes">{SCOPES.map((s) => <button type="button" key={s} className={`ss-m-scope${scope === s ? " on" : ""}`} aria-pressed={scope === s} onClick={() => setScope(s)}>{s}</button>)}</nav>
      </header>
      <div className="ss-m-body">{body}</div>
      {has && !data.pending && scoped.length > 0 && <div className="ss-m-foot"><button type="button" className="ss-m-all" onClick={() => go(q)}>See all {data.results.length} results →</button></div>}
      {sheet && (
        <>
          <div className="ss-m-scrim" onClick={() => { voice.stop(); setSheet(null); }} aria-hidden="true" />
          <div className="ss-m-sheet" role="dialog" aria-label={sheet === "voice" ? "Voice search" : "Photo search"}>
            <span className="ss-m-handle" aria-hidden="true" />
            {sheet === "voice" ? (
              <div className="ss-m-voice">
                <LangToggle lang={voice.lang} setLang={voice.setLang} />
                <button type="button" className={`ss-m-mic${voice.listening ? "" : " idle"}`} aria-label={voice.listening ? "Stop listening" : "Start listening"} onClick={voice.toggle}>{I.mic(34)}</button>
                {voice.error ? <p className="ss-err" role="alert">{voice.error}</p> : <><Wave n={11} /><b className="ss-voice-t">{voice.listening ? <>Listening… <span className="bn">বলুন</span></> : "Tap the mic to speak"}</b></>}
                {q && <p className="ss-tip-s">“{q}”</p>}
                <button type="button" className="ss-m-cancel" onClick={() => { voice.stop(); setSheet(null); }}>Cancel</button>
              </div>
            ) : (
              <div className="ss-m-photo">
                <b className="ss-m-sheet-t">Search by photo</b>
                {photo.url ? <PhotoMessage url={photo.url} /> : (
                  <div className="ss-m-photo-btns">
                    <label className="ss-m-pbtn">{I.cam(20)}Take a photo<input type="file" accept="image/*" capture="environment" className="hm-sr" onChange={(e) => photo.pick(e.target.files?.[0])} /></label>
                    <label className="ss-m-pbtn alt">From gallery<input type="file" accept="image/*" className="hm-sr" onChange={(e) => photo.pick(e.target.files?.[0])} /></label>
                  </div>
                )}
                <button type="button" className="ss-m-cancel" onClick={() => setSheet(null)}>Close</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
