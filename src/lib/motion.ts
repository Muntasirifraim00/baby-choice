import { useEffect, useRef, useState } from "react";

/** Shared header motion pause state: data-motion on <html>, persisted in localStorage `bc-motion`. */
const KEY = "bc-motion";
let paused = false;
let loaded = false;
const listeners = new Set<(v: boolean) => void>();

function apply(v: boolean) {
  paused = v;
  if (typeof document !== "undefined") {
    if (v) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
  }
  listeners.forEach((fn) => fn(v));
}

export function useMotionPaused() {
  const [value, setValue] = useState(false);
  useEffect(() => {
    if (!loaded) {
      loaded = true;
      try {
        apply(localStorage.getItem(KEY) === "paused");
      } catch {
        /* storage unavailable */
      }
    }
    setValue(paused);
    listeners.add(setValue);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  const toggle = () => {
    const next = !paused;
    try {
      localStorage.setItem(KEY, next ? "paused" : "playing");
    } catch {
      /* storage unavailable */
    }
    apply(next);
  };
  return [value, toggle] as const;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Typewriter placeholder: "Search " + phrase, 85ms per char, ~1.9s hold. Returns null when inactive. */
export function useTypewriter(phrases: string[], active: boolean) {
  const [text, setText] = useState<string | null>(null);
  const state = useRef({ i: 0, n: 0, dir: 1 as 1 | -1 });
  useEffect(() => {
    if (!active) {
      setText(null);
      return;
    }
    let t: number;
    const tick = () => {
      const s = state.current;
      const phrase = phrases[s.i % phrases.length]!;
      let delay = 85;
      if (s.dir === 1) {
        s.n++;
        if (s.n >= phrase.length) {
          s.n = phrase.length;
          s.dir = -1;
          delay = 1900;
        }
      } else {
        s.n--;
        if (s.n <= 0) {
          s.n = 0;
          s.dir = 1;
          s.i++;
        }
      }
      setText("Search " + phrase.slice(0, s.n));
      t = window.setTimeout(tick, delay);
    };
    t = window.setTimeout(tick, 85);
    return () => window.clearTimeout(t);
  }, [active, phrases]);
  return active ? text : null;
}

/** Returns a key that changes whenever `count` increases (used to replay the bump animation). */
export function useBumpKey(count: number) {
  const prev = useRef(count);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (count > prev.current) setKey((k) => k + 1);
    prev.current = count;
  }, [count]);
  return key;
}
