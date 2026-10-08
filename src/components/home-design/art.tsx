/* 3D-style illustrations from the Baby Choice homepage design (SVG, gradient ids prefixed "hd"). */
type P = { className?: string | undefined; width?: number | string; height?: number | string };

export function HdGradients() {
  const lin = (id: string, a: string, b: string) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {lin("hdPink", "#ff9cbd", "#e8336f")}
        {lin("hdPurple", "#a57cff", "#5b2bd6")}
        {lin("hdBlue", "#8fd0ff", "#2f7de0")}
        {lin("hdYellow", "#ffe98a", "#f5a623")}
        {lin("hdMint", "#9af3cd", "#1fae73")}
        {lin("hdOrange", "#ffc08a", "#f0782d")}
        {lin("hdWhite", "#ffffff", "#e6def6")}
        {lin("hdBrown", "#e2b48a", "#a06c45")}
        <radialGradient id="hdSkin" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffeadb" />
          <stop offset="1" stopColor="#f5b993" />
        </radialGradient>
        <radialGradient id="hdHood" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#e7d3bb" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export const LogoHeart = ({ className, width = 48, height = 44 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 44 40" aria-hidden="true">
    <path
      d="M22 38C8 28 2 20 2 12 2 6 7 2 12.5 2c4 0 7.5 2.3 9.5 5.6C24 4.3 27.5 2 31.5 2 37 2 42 6 42 12c0 8-6 16-20 26z"
      fill="url(#hdPink)"
    />
    <ellipse cx="13" cy="9" rx="5" ry="3" fill="#ffffff" opacity="0.5" />
    <circle cx="22" cy="18" r="9" fill="url(#hdSkin)" />
    <circle cx="19" cy="17" r="1.3" fill="#2a1650" />
    <circle cx="25" cy="17" r="1.3" fill="#2a1650" />
    <path
      d="M19 21q3 2.6 6 0"
      fill="none"
      stroke="#c2334a"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Star = ({
  className,
  width = 24,
  height = 24,
  fill = "url(#hdYellow)",
}: P & { fill?: string }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"
      fill={fill}
    />
  </svg>
);

export const Balloon = ({
  className,
  width = 52,
  height = 86,
  tone = "Pink",
}: P & { tone?: "Pink" | "Purple" }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 34 58" aria-hidden="true">
    <ellipse cx="17" cy="17" rx="15" ry="17" fill={`url(#hd${tone})`} />
    <ellipse cx="11" cy="10" rx="4" ry="6" fill="#ffffff" opacity="0.55" />
    <path d="M17 34l-3 4h6z" fill={tone === "Pink" ? "#e8336f" : "#5b2bd6"} />
    <path
      d={tone === "Pink" ? "M17 38q-4 8 0 18" : "M17 38q4 8 0 18"}
      stroke="#c9a6d9"
      strokeWidth="1.2"
      fill="none"
    />
  </svg>
);

export const HeroBaby = ({ className }: P) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 210 210"
    preserveAspectRatio="xMaxYMax meet"
    role="img"
    aria-label="Baby in a bear-ear hooded towel"
  >
    <circle cx="72" cy="66" r="21" fill="url(#hdHood)" />
    <circle cx="72" cy="66" r="10" fill="#efc9a6" />
    <circle cx="176" cy="66" r="21" fill="url(#hdHood)" />
    <circle cx="176" cy="66" r="10" fill="#efc9a6" />
    <path d="M50 210c0-62 20-138 74-138s74 76 74 138z" fill="url(#hdHood)" />
    <ellipse cx="124" cy="134" rx="46" ry="44" fill="url(#hdSkin)" />
    <path
      d="M78 120c4-34 26-44 46-44s42 10 46 44c-11-15-27-20-46-20s-35 5-46 20z"
      fill="url(#hdHood)"
    />
    <ellipse cx="108" cy="132" rx="7" ry="8.5" fill="#2b1d18" />
    <ellipse cx="141" cy="132" rx="7" ry="8.5" fill="#2b1d18" />
    <circle cx="110.5" cy="129" r="2.6" fill="#ffffff" />
    <circle cx="143.5" cy="129" r="2.6" fill="#ffffff" />
    <ellipse cx="95" cy="151" rx="9" ry="5.5" fill="#ff9fb0" opacity="0.7" />
    <ellipse cx="154" cy="151" rx="9" ry="5.5" fill="#ff9fb0" opacity="0.7" />
    <path d="M110 152q14 17 28 0z" fill="#c2334a" />
    <ellipse cx="100" cy="100" rx="14" ry="6" fill="#ffffff" opacity="0.5" />
  </svg>
);

export const HeroDuck = ({ className }: P) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 200 190"
    preserveAspectRatio="xMaxYMax meet"
    role="img"
    aria-label="Rubber duck in a bubble bath"
  >
    <path d="M30 130h160v20c0 24-30 36-80 36S30 174 30 150z" fill="url(#hdWhite)" />
    <ellipse cx="110" cy="130" rx="80" ry="14" fill="#b9e3ff" />
    <ellipse cx="96" cy="118" rx="44" ry="26" fill="url(#hdYellow)" />
    <circle cx="128" cy="82" r="26" fill="url(#hdYellow)" />
    <path d="M150 84l22 4-22 8z" fill="url(#hdOrange)" />
    <circle cx="134" cy="76" r="4.5" fill="#2b1d18" />
    <circle cx="135.5" cy="74.5" r="1.5" fill="#ffffff" />
    <ellipse cx="118" cy="68" rx="9" ry="5" fill="#ffffff" opacity="0.6" />
    <circle cx="52" cy="118" r="12" fill="#ffffff" opacity="0.9" />
    <circle cx="40" cy="106" r="8" fill="#ffffff" opacity="0.8" />
    <circle cx="170" cy="120" r="10" fill="#ffffff" opacity="0.9" />
  </svg>
);

export const HeroTeddy = ({ className }: P) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 200 190"
    preserveAspectRatio="xMaxYMax meet"
    role="img"
    aria-label="Teddy bear and alphabet blocks"
  >
    <rect x="20" y="130" width="46" height="46" rx="10" fill="url(#hdBlue)" />
    <text
      x="43"
      y="162"
      fontFamily="'Baloo 2', sans-serif"
      fontSize="28"
      fontWeight="800"
      fill="#ffffff"
      textAnchor="middle"
    >
      A
    </text>
    <rect x="34" y="88" width="40" height="40" rx="10" fill="url(#hdPink)" />
    <text
      x="54"
      y="116"
      fontFamily="'Baloo 2', sans-serif"
      fontSize="24"
      fontWeight="800"
      fill="#ffffff"
      textAnchor="middle"
    >
      B
    </text>
    <circle cx="112" cy="56" r="13" fill="url(#hdBrown)" />
    <circle cx="168" cy="56" r="13" fill="url(#hdBrown)" />
    <ellipse cx="140" cy="142" rx="44" ry="40" fill="url(#hdBrown)" />
    <circle cx="140" cy="84" r="36" fill="url(#hdBrown)" />
    <ellipse cx="140" cy="96" rx="16" ry="12" fill="#f6dcc0" />
    <circle cx="127" cy="78" r="4.5" fill="#2b1d18" />
    <circle cx="153" cy="78" r="4.5" fill="#2b1d18" />
    <ellipse cx="140" cy="91" rx="5" ry="3.5" fill="#2b1d18" />
    <ellipse cx="140" cy="146" rx="22" ry="20" fill="#f6dcc0" />
    <path d="M126 124l14 8 14-8-14 -6z" fill="url(#hdPink)" />
  </svg>
);

export const Duck = ({ className, width = 120, height = 104 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 80 70" aria-hidden="true">
    <ellipse cx="44" cy="52" rx="28" ry="16" fill="url(#hdYellow)" />
    <circle cx="54" cy="28" r="16" fill="url(#hdYellow)" />
    <path d="M68 28l10 2-10 4z" fill="url(#hdOrange)" />
    <circle cx="58" cy="24" r="2.4" fill="#2a1650" />
    <ellipse cx="48" cy="20" rx="5" ry="3" fill="#ffffff" opacity="0.6" />
  </svg>
);

export const Teddy = ({ className, width = 64, height = 64 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 60 60" aria-hidden="true">
    <circle cx="16" cy="16" r="9" fill="url(#hdBrown)" />
    <circle cx="44" cy="16" r="9" fill="url(#hdBrown)" />
    <circle cx="30" cy="32" r="22" fill="url(#hdBrown)" />
    <ellipse cx="30" cy="40" rx="10" ry="7" fill="#f6dcc0" />
    <circle cx="22" cy="29" r="2.6" fill="#2b1d18" />
    <circle cx="38" cy="29" r="2.6" fill="#2b1d18" />
    <ellipse cx="30" cy="37" rx="3" ry="2.2" fill="#2b1d18" />
  </svg>
);

export const Truck = ({ className, width = 38, height = 38 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 6h12v10H2zM14 9h4l3 3v4h-7z" fill="url(#hdPurple)" />
    <circle cx="6" cy="18" r="2" fill="#2a1650" />
    <circle cx="17" cy="18" r="2" fill="#2a1650" />
  </svg>
);
export const Shield = ({ className, width = 38, height = 38 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" fill="url(#hdMint)" />
    <path
      d="m8.5 12 2.5 2.5 4.5-5"
      stroke="#ffffff"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const Cash = ({ className, width = 38, height = 38 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="6" width="20" height="13" rx="3" fill="url(#hdYellow)" />
    <circle cx="12" cy="12.5" r="3" fill="#ffffff" />
  </svg>
);
export const Box = ({ className, width = 38, height = 38 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 3 7v10l9 5 9-5V7z" fill="url(#hdPink)" />
    <path d="M3 7l9 5 9-5M12 12v10" stroke="#ffffff" strokeWidth="1.6" fill="none" />
  </svg>
);
export const GiftBox = ({ className, width = 24, height = 24 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="10" width="18" height="11" rx="2" fill="url(#hdPink)" />
    <rect x="2" y="7" width="20" height="5" rx="1.5" fill="url(#hdPurple)" />
    <rect x="10.5" y="7" width="3" height="14" fill="url(#hdYellow)" />
    <path d="M12 7C9 2 5 3 6.5 6S12 7 12 7s4.5 1 5.5-1S15 2 12 7z" fill="url(#hdYellow)" />
    <rect x="4" y="12" width="2" height="7" rx="1" fill="#ffffff" opacity="0.4" />
  </svg>
);
export const Bolt = ({ className, width = 40, height = 40 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="url(#hdYellow)" />
  </svg>
);
export const Moon = ({ className, width = 110, height = 110 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 15A8 8 0 1 1 9 4a6.5 6.5 0 0 0 11 11z" fill="url(#hdYellow)" />
    <circle cx="18" cy="5" r="1" fill="#ffd166" />
    <circle cx="21" cy="9" r="0.8" fill="#ffd166" />
  </svg>
);
export const FoodBowl = ({ className, width = 150, height = 108 }: P) => (
  <svg className={className} width={width} height={height} viewBox="0 0 50 36" aria-hidden="true">
    <path d="M4 14h34q0 18-17 18T4 14z" fill="url(#hdPink)" />
    <ellipse cx="21" cy="14" rx="17" ry="4" fill="#ffd8e3" />
    <circle cx="16" cy="12" r="3.5" fill="url(#hdMint)" />
    <circle cx="24" cy="11" r="3" fill="url(#hdOrange)" />
    <path d="M34 10 47 3" stroke="#f5a623" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const Bottle = ({
  className,
  width = 66,
  height = 122,
  collar = "url(#hdPurple)",
}: P & { collar?: string }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 24 46" aria-hidden="true">
    <path d="M8 8q4-10 8 0z" fill="#f5d9b3" />
    <rect x="5" y="8" width="14" height="6" rx="2" fill={collar} />
    <rect x="4" y="14" width="16" height="30" rx="6" fill="url(#hdWhite)" stroke="#9cb4ee" />
    <rect x="6" y="16" width="4" height="24" rx="2" fill="#ffffff" />
  </svg>
);

/* category icons */
export type CatArt = "onesie" | "bottle" | "diaper" | "toy" | "stroller" | "wash" | "can" | "gift";
export function CategoryArt({ kind, className }: { kind: CatArt; className?: string }) {
  switch (kind) {
    case "onesie":
      return (
        <svg className={className} width="62%" height="62%" viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M6 8l7-4h4q3 4 6 0h4l7 4-4 8-4-2v22h-6l-3-5-3 5h-6V14l-4 2z"
            fill="url(#hdBlue)"
          />
          <path d="M13 6q3 6 7 6" stroke="#ffffff" strokeWidth="2" opacity="0.5" fill="none" />
          <circle cx="20" cy="20" r="2.4" fill="#ffffff" />
        </svg>
      );
    case "bottle":
      return <Bottle className={className} width="40%" height="66%" collar="url(#hdOrange)" />;
    case "diaper":
      return (
        <svg className={className} width="66%" height="56%" viewBox="0 0 64 54" aria-hidden="true">
          <path
            d="M6 8h52v12c0 18-12 30-26 30S6 38 6 20z"
            fill="url(#hdWhite)"
            stroke="#f3a5bf"
            strokeWidth="1.5"
          />
          <rect x="6" y="8" width="52" height="8" rx="3" fill="url(#hdPink)" />
          <circle cx="24" cy="30" r="2.5" fill="#ffb3c8" />
          <circle cx="40" cy="30" r="2.5" fill="#ffb3c8" />
          <path
            d="M27 36q5 4 10 0"
            stroke="#f0457a"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "toy":
      return (
        <svg className={className} width="58%" height="62%" viewBox="0 0 40 44" aria-hidden="true">
          <rect x="18" y="4" width="4" height="34" rx="2" fill="url(#hdBrown)" />
          <ellipse cx="20" cy="38" rx="14" ry="5" fill="url(#hdYellow)" />
          <ellipse cx="20" cy="32" rx="11" ry="4.5" fill="url(#hdMint)" />
          <ellipse cx="20" cy="26" rx="9" ry="4" fill="url(#hdBlue)" />
          <ellipse cx="20" cy="20" rx="7" ry="3.5" fill="url(#hdPurple)" />
          <ellipse cx="20" cy="14" rx="5" ry="3" fill="url(#hdPink)" />
          <circle cx="20" cy="6" r="3.5" fill="url(#hdYellow)" />
        </svg>
      );
    case "stroller":
      return (
        <svg className={className} width="62%" height="62%" viewBox="0 0 30 40" aria-hidden="true">
          <path d="M2 6q12 0 16 16H2z" fill="url(#hdPurple)" />
          <path d="M2 22h18l-4 10H6z" fill="#3c3c46" />
          <path d="M18 22l6-16" stroke="#3c3c46" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6" cy="36" r="3.5" fill="none" stroke="#3c3c46" strokeWidth="2" />
          <circle cx="17" cy="36" r="3.5" fill="none" stroke="#3c3c46" strokeWidth="2" />
        </svg>
      );
    case "wash":
      return (
        <svg className={className} width="44%" height="64%" viewBox="0 0 24 40" aria-hidden="true">
          <rect x="3" y="12" width="18" height="27" rx="5" fill="url(#hdMint)" />
          <path d="M8 12V6h8v6" fill="url(#hdWhite)" />
          <path d="M12 6V2h6" stroke="#1fae73" strokeWidth="2" fill="none" />
          <rect x="5" y="14" width="4" height="20" rx="2" fill="#ffffff" opacity="0.5" />
        </svg>
      );
    case "can":
      return (
        <svg className={className} width="46%" height="62%" viewBox="0 0 30 40" aria-hidden="true">
          <rect x="3" y="2" width="24" height="8" rx="3" fill="url(#hdOrange)" />
          <rect x="2" y="8" width="26" height="30" rx="4" fill="url(#hdWhite)" stroke="#f0b46a" />
          <rect x="2" y="24" width="26" height="14" rx="4" fill="url(#hdOrange)" />
          <rect x="4" y="10" width="4" height="12" rx="2" fill="#ffffff" />
        </svg>
      );
    case "gift":
      return <GiftBox className={className} width="58%" height="58%" />;
  }
}
