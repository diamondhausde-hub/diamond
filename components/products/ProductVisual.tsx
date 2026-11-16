import type { ProductId } from "@/data/products";

type Props = {
  variant: ProductId;
  className?: string;
};

/**
 * Editorial product illustrations in the DIAMOND palette.
 * They are intentionally restrained technical renders, not stock photography.
 * Each product can be replaced with a real photo via `image` in data/products.ts.
 */
export function ProductVisual({ variant, className }: Props) {
  return (
    <svg
      viewBox="26 26 348 430"
      role="img"
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={`metal-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F9FBFD" />
          <stop offset="0.45" stopColor="#DCE6F0" />
          <stop offset="1" stopColor="#B9C9DA" />
        </linearGradient>
        <linearGradient id={`navy-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#183A63" />
          <stop offset="1" stopColor="#0B2545" />
        </linearGradient>
        <linearGradient id={`green-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2FA765" />
          <stop offset="1" stopColor="#1D8A4E" />
        </linearGradient>
        <linearGradient id={`cloth-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#F1F6FB" />
          <stop offset="1" stopColor="#DDE8F3" />
        </linearGradient>
        <pattern
          id={`weave-${variant}`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0v7M0 0h7" stroke="#9FB3C7" strokeWidth="0.45" opacity="0.5" />
        </pattern>
        <radialGradient id={`glow-${variant}`} cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <pattern id="weave-shared" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0v7M0 0h7" stroke="#9FB3C7" strokeWidth="0.45" opacity="0.5" />
        </pattern>
      </defs>

      <ellipse cx="200" cy="420" rx="122" ry="13" fill="#0B2545" opacity="0.07" />
      <circle cx="200" cy="230" r="168" fill={`url(#glow-${variant})`} opacity="0.55" />

      {variant === "glassCloth" && <GlassCloth />}
      {variant === "windowSqueegee" && <WindowSqueegee />}
      {variant === "floorSqueegee" && <FloorSqueegee />}
      {variant === "floorMop" && <FloorMop />}
      {variant === "brushesBrooms" && <Brushes />}
      {variant === "wasteBags" && <WasteBags />}
    </svg>
  );
}

function GlassCloth() {
  return (
    <g transform="translate(200 250) scale(1.16) translate(-200 -250)">
      {/* second fold, slightly offset */}
      <g transform="rotate(-7 200 255)">
        <rect x="98" y="175" width="212" height="196" rx="5" fill="#D5E2EE" />
      </g>
      <g transform="rotate(-3 200 250)">
        <rect
          x="88"
          y="160"
          width="224"
          height="204"
          rx="5"
          fill="url(#cloth-glassCloth)"
          stroke="#CBD9E6"
          strokeWidth="1"
        />
        <rect
          x="88"
          y="160"
          width="224"
          height="204"
          rx="5"
          fill="url(#weave-glassCloth)"
          opacity="0.65"
        />
        {/* soft fold */}
        <path
          d="M88 232c42 20 84 22 126 6s68-16 98-4v34c-38-14-72-6-108 8s-78 10-116-8Z"
          fill="#FFFFFF"
          opacity="0.45"
        />
        <path
          d="M88 318c40 12 86 8 122-6s74-14 102-2v54H88Z"
          fill="#0B2545"
          opacity="0.94"
        />
        <path d="M96 330h208" stroke="#F5B700" strokeWidth="1" strokeDasharray="3 5" opacity="0.9" />
        {/* stitched label */}
        <g transform="rotate(-2 118 198)">
          <rect x="104" y="180" width="52" height="52" fill="#FFFFFF" />
          <rect x="104" y="180" width="52" height="52" fill="none" stroke="#1D8A4E" strokeWidth="1" />
          <path
            d="M130 190c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z"
            fill="#F5B700"
          />
          <rect x="118" y="216" width="24" height="2" fill="#0B2545" />
        </g>
      </g>
      {/* corner highlight */}
      <path
        d="M300 172l30 14-16 30-30-14Z"
        fill="#FFFFFF"
        opacity="0.5"
      />
    </g>
  );
}

function WindowSqueegee() {
  return (
    <g>
      <g transform="rotate(7 200 250)">
        {/* handle */}
        <rect x="163" y="108" width="74" height="170" rx="26" fill="#C9D6E3" />
        <rect x="170" y="115" width="60" height="156" rx="21" fill="#0B2545" />
        <rect x="182" y="130" width="36" height="8" rx="4" fill="#F4F8FC" opacity="0.22" />
        <rect x="182" y="150" width="36" height="4" rx="2" fill="#F4F8FC" opacity="0.16" />
        <rect x="182" y="164" width="36" height="4" rx="2" fill="#F4F8FC" opacity="0.16" />
        <rect x="182" y="178" width="36" height="4" rx="2" fill="#F4F8FC" opacity="0.16" />
        {/* neck */}
        <rect x="180" y="272" width="40" height="26" rx="4" fill="#AFC0D2" />
        <rect x="184" y="296" width="32" height="14" fill="#8497AB" />
        {/* head */}
        <rect x="66" y="306" width="268" height="42" rx="10" fill="#0B2545" />
        <rect x="66" y="306" width="268" height="10" rx="5" fill="#2C4F78" />
        {/* blade */}
        <rect x="60" y="345" width="280" height="20" rx="7" fill="#1D8A4E" />
        <rect x="60" y="345" width="280" height="6" rx="3" fill="#34A868" />
        <rect x="72" y="352" width="256" height="2" fill="#FFFFFF" opacity="0.28" />
        {/* end caps */}
        <rect x="52" y="303" width="18" height="46" rx="5" fill="#16385F" />
        <rect x="330" y="303" width="18" height="46" rx="5" fill="#16385F" />
      </g>
      <circle cx="112" cy="147" r="4" fill="#1D8A4E" opacity="0.5" />
      <circle cx="310" cy="196" r="3" fill="#1D8A4E" opacity="0.45" />
    </g>
  );
}

function FloorSqueegee() {
  return (
    <g>
      {/* handle */}
      <g transform="rotate(4 200 210)">
        <rect x="190" y="72" width="20" height="206" rx="10" fill="#0B2545" />
        <rect x="184" y="64" width="32" height="66" rx="16" fill="#16385F" />
        <rect x="196" y="80" width="8" height="30" rx="4" fill="#F5B700" opacity="0.85" />
        <rect x="184" y="262" width="32" height="44" rx="6" fill="#16385F" />
      </g>
      {/* head */}
      <rect x="52" y="302" width="296" height="26" rx="9" fill="#C9D6E3" />
      <rect x="52" y="302" width="296" height="9" rx="4.5" fill="#EAF1F8" />
      <rect x="44" y="300" width="20" height="32" rx="6" fill="#16385F" />
      <rect x="336" y="300" width="20" height="32" rx="6" fill="#16385F" />
      {/* double foam blades */}
      <rect x="60" y="330" width="280" height="26" rx="12" fill="#1D8A4E" />
      <rect x="60" y="330" width="280" height="8" rx="4" fill="#34A868" />
      <g fill="#FFFFFF" opacity="0.22">
        <circle cx="92" cy="345" r="2" />
        <circle cx="132" cy="343" r="2" />
        <circle cx="172" cy="346" r="2" />
        <circle cx="212" cy="343" r="2" />
        <circle cx="252" cy="346" r="2" />
        <circle cx="292" cy="344" r="2" />
      </g>
      <rect x="60" y="362" width="280" height="26" rx="12" fill="#17703F" />
      <rect x="60" y="362" width="280" height="7" rx="3.5" fill="#2FA765" />
      <g fill="#FFFFFF" opacity="0.16">
        <circle cx="104" cy="377" r="2" />
        <circle cx="148" cy="375" r="2" />
        <circle cx="192" cy="378" r="2" />
        <circle cx="236" cy="375" r="2" />
        <circle cx="280" cy="377" r="2" />
      </g>
      <rect x="48" y="327" width="14" height="64" rx="5" fill="#16385F" />
      <rect x="338" y="327" width="14" height="64" rx="5" fill="#16385F" />
    </g>
  );
}

function FloorMop() {
  return (
    <g>
      {/* handle */}
      <g transform="rotate(13 200 250)">
        <rect x="190" y="64" width="18" height="252" rx="9" fill="#0B2545" />
        <rect x="184" y="54" width="30" height="58" rx="15" fill="#16385F" />
        <rect x="194" y="70" width="10" height="26" rx="5" fill="#F5B700" opacity="0.9" />
        {/* joint */}
        <circle cx="199" cy="324" r="26" fill="#16385F" />
        <circle cx="199" cy="324" r="14" fill="#1D8A4E" />
        <circle cx="199" cy="324" r="5" fill="#F4F8FC" />
        <rect x="190" y="338" width="18" height="18" fill="#16385F" />
      </g>
      {/* mop pad */}
      <g transform="rotate(-3 200 392)">
        <rect x="86" y="352" width="228" height="66" rx="30" fill="#DCE8F3" />
        <rect
          x="86"
          y="352"
          width="228"
          height="66"
          rx="30"
          fill="url(#weave-shared)"
          opacity="0.8"
        />
        <rect x="86" y="352" width="228" height="66" rx="30" fill="none" stroke="#C2D1E0" />
        <path d="M114 374h172a18 18 0 0 1 0 26H114a18 18 0 0 1 0-26Z" fill="#1D8A4E" opacity="0.14" />
        <path d="M120 366v36M148 362v42M176 360v44M204 360v44M232 362v42M260 366v36" stroke="#9FB3C7" strokeWidth="1" opacity="0.55" />
      </g>
    </g>
  );
}

function Brushes() {
  return (
    <g>
      {/* broom */}
      <g transform="rotate(-6 175 240)">
        <rect x="166" y="50" width="18" height="238" rx="9" fill="#0B2545" />
        <rect x="159" y="40" width="32" height="56" rx="16" fill="#16385F" />
        <rect x="171" y="54" width="8" height="28" rx="4" fill="#F5B700" />
        <rect x="96" y="278" width="158" height="40" rx="8" fill="#16385F" />
        <rect x="96" y="278" width="158" height="10" rx="5" fill="#2C4F78" />
        <path
          d="M102 318h146l-10 92H112Z"
          fill="#B8C8D8"
        />
        {Array.from({ length: 13 }).map((_, index) => (
          <path
            key={index}
            d={`M${108 + index * 11.4} 322v${70 + (index % 3) * 5}`}
            stroke="#8CA1B6"
            strokeWidth="1.6"
          />
        ))}
        <path d="M110 410h130" stroke="#8CA1B6" strokeWidth="1.6" />
      </g>
      {/* hand brush */}
      <g transform="rotate(17 285 330)">
        <rect x="246" y="250" width="26" height="112" rx="13" fill="#1D8A4E" />
        <rect x="250" y="246" width="18" height="26" rx="9" fill="#34A868" />
        <rect x="214" y="352" width="92" height="34" rx="7" fill="#0B2545" />
        <rect x="214" y="352" width="92" height="8" rx="4" fill="#2C4F78" />
        <path d="M220 386h80l-6 48h-68Z" fill="#D7C6A5" />
        {Array.from({ length: 9 }).map((_, index) => (
          <path
            key={index}
            d={`M${226 + index * 8.5} 390v${36 + (index % 2) * 4}`}
            stroke="#B29E7A"
            strokeWidth="1.4"
          />
        ))}
      </g>
    </g>
  );
}

function WasteBags() {
  return (
    <g>
      {/* roll */}
      <g transform="rotate(-5 200 170)">
        <rect x="82" y="118" width="236" height="96" rx="46" fill="#B9CBDD" />
        <rect x="82" y="118" width="236" height="96" rx="46" fill="url(#metal-wasteBags)" opacity="0.5" />
        <ellipse cx="318" cy="166" rx="12" ry="46" fill="#E4EDF5" />
        <ellipse cx="82" cy="166" rx="12" ry="46" fill="#D2DFEB" />
        <ellipse cx="82" cy="166" rx="7" ry="32" fill="#F7FAFD" />
        <path d="M96 132h196M96 200h196" stroke="#8FA6BC" strokeWidth="1" opacity="0.5" />
        <rect x="176" y="138" width="48" height="56" rx="2" fill="#F5B700" opacity="0.9" />
        <path d="M200 148c1 7 3 9 10 10-7 1-9 3-10 10-1-7-3-9-10-10 7-1 9-3 10-10Z" fill="#0B2545" />
      </g>
      {/* bag */}
      <g>
        <path
          d="M140 232c6-18 22-26 60-26s54 8 60 26l14 138c2 18-10 28-30 28h-88c-20 0-32-10-30-28Z"
          fill="#F2F7FB"
          stroke="#C9D8E6"
        />
        <path d="M140 232c6-18 22-26 60-26s54 8 60 26" fill="none" stroke="#1D8A4E" strokeWidth="7" />
        <path d="M148 232c10 10 32 14 52 14s42-4 52-14" fill="none" stroke="#17703F" strokeWidth="2" opacity="0.5" />
        <circle cx="200" cy="252" r="4" fill="#1D8A4E" />
        {/* drawstring */}
        <path d="M156 238c12 30 76 30 88 0" fill="none" stroke="#0B2545" strokeWidth="2" strokeDasharray="4 4" opacity="0.55" />
        <rect x="196" y="244" width="10" height="16" rx="4" fill="#0B2545" />
        {/* star sealed base */}
        <path d="M146 360l54-28 54 28-16 34h-76Z" fill="#FFFFFF" opacity="0.55" />
        <path d="M146 360l54-28 54 28M200 332v62M146 360l54 34 54-34" stroke="#C9D8E6" fill="none" />
        <path d="M200 394v22M154 368l34 48M246 368l-34 48" stroke="#B9CBDD" fill="none" strokeWidth="0.8" />
        <rect x="168" y="282" width="64" height="3" fill="#0B2545" opacity="0.25" />
        <rect x="176" y="294" width="48" height="2" fill="#0B2545" opacity="0.15" />
      </g>
    </g>
  );
}
