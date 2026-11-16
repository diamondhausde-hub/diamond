type Props = {
  dirty?: boolean;
  idPrefix: string;
  className?: string;
};

/**
 * One illustrated window scene, rendered twice with identical geometry.
 * Only the dirt layer differs, so the comparison stays truthful to the image.
 */
export function GlassScene({ dirty, idPrefix, className }: Props) {
  const sky = `sky-${idPrefix}`;
  const glass = `glass-${idPrefix}`;
  const foliage = `foliage-${idPrefix}`;
  const haze = `haze-${idPrefix}`;

  return (
    <svg
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA9C8" />
          <stop offset="0.55" stopColor="#C2D9EA" />
          <stop offset="1" stopColor="#E6F0F7" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={foliage} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6E9377" />
          <stop offset="1" stopColor="#3C6650" />
        </linearGradient>
        <radialGradient id={haze} cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${idPrefix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`soft2-${idPrefix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* wall */}
      <rect width="1200" height="760" fill="#0E2743" />
      <rect x="34" y="24" width="1132" height="660" fill="#0A1F38" />
      <rect x="34" y="24" width="1132" height="8" fill="#23425F" opacity="0.6" />

      {/* view outside */}
      <g>
        <rect x="52" y="42" width="1096" height="606" fill={`url(#${sky})`} />
        <circle cx="920" cy="140" r="62" fill="#F7FAFC" opacity="0.55" filter={`url(#soft-${idPrefix})`} />
        <circle cx="820" cy="118" r="40" fill="#FFFFFF" opacity="0.4" filter={`url(#soft-${idPrefix})`} />
        <circle cx="240" cy="128" r="70" fill="#FFFFFF" opacity="0.35" filter={`url(#soft-${idPrefix})`} />

        {/* distant skyline */}
        <g fill="#9DB3C4" opacity="0.55">
          <rect x="80" y="330" width="46" height="318" />
          <rect x="132" y="386" width="38" height="262" />
          <rect x="176" y="352" width="58" height="296" />
          <rect x="246" y="410" width="32" height="238" />
          <rect x="940" y="360" width="42" height="288" />
          <rect x="988" y="322" width="56" height="326" />
          <rect x="1050" y="392" width="34" height="256" />
        </g>
        <g fill="#7C95A9" opacity="0.35">
          <rect x="92" y="356" width="14" height="18" />
          <rect x="92" y="392" width="14" height="18" />
          <rect x="193" y="380" width="16" height="20" />
          <rect x="1003" y="350" width="16" height="20" />
          <rect x="1003" y="390" width="16" height="20" />
        </g>

        {/* foliage */}
        <g filter={`url(#soft-${idPrefix})`}>
          <circle cx="132" cy="628" r="96" fill={`url(#${foliage})`} />
          <circle cx="222" cy="672" r="68" fill="#5D8069" />
          <circle cx="330" cy="700" r="88" fill="#587C64" />
          <circle cx="1084" cy="640" r="104" fill={`url(#${foliage})`} />
          <circle cx="982" cy="690" r="78" fill="#5D8069" />
          <circle cx="880" cy="712" r="66" fill="#6D8F79" />
        </g>
      </g>

      {/* reflections */}
      <rect x="52" y="42" width="1096" height="606" fill={`url(#${glass})`} />
      <path d="M300 42l210 606h132L432 42Z" fill="#FFFFFF" opacity="0.1" />
      <path d="M720 42l140 606h58L778 42Z" fill="#FFFFFF" opacity="0.08" />
      <path d="M150 648l120-606h44L194 648Z" fill="#FFFFFF" opacity="0.06" />

      {/* dirt layer — only differs from the clean render */}
      {dirty ? (
        <g>
          {/* dull film across the pane */}
          <rect x="52" y="42" width="1096" height="606" fill="#87949F" opacity="0.13" />
          <rect x="52" y="42" width="1096" height="606" fill={`url(#${haze})`} opacity="0.85" />
          {/* streaks */}
          <g stroke="#97A6B1" opacity="0.62" filter={`url(#soft2-${idPrefix})`}>
            <path d="M250 60c18 160-12 300 8 560" strokeWidth="12" fill="none" />
            <path d="M470 60c-14 200 10 330-4 560" strokeWidth="8" fill="none" />
            <path d="M760 60c22 180-8 320 6 560" strokeWidth="14" fill="none" />
            <path d="M970 60c-16 210 8 350-6 560" strokeWidth="7" fill="none" />
          </g>
          <g stroke="#6F7E8A" opacity="0.34" filter={`url(#soft2-${idPrefix})`}>
            <path d="M360 90c10 130-6 240 4 420" strokeWidth="3" fill="none" />
            <path d="M620 70c-10 150 8 270-2 500" strokeWidth="2.5" fill="none" />
            <path d="M860 110c-8 150 6 260-4 390" strokeWidth="4" fill="none" />
          </g>
          {/* water marks */}
          <g fill="#AEBCC6" opacity="0.72">
            <circle cx="330" cy="170" r="17" />
            <circle cx="342" cy="196" r="8" />
            <circle cx="368" cy="188" r="5" />
            <circle cx="640" cy="250" r="12" />
            <circle cx="666" cy="268" r="6" />
            <circle cx="913" cy="196" r="19" />
            <circle cx="890" cy="226" r="9" />
            <circle cx="520" cy="470" r="14" />
            <circle cx="548" cy="494" r="6" />
            <circle cx="1010" cy="505" r="11" />
            <circle cx="760" cy="370" r="8" />
            <circle cx="186" cy="540" r="13" />
          </g>
          <g fill="#FFFFFF" opacity="0.42">
            <ellipse cx="330" cy="168" rx="13" ry="8" />
            <ellipse cx="913" cy="194" rx="14" ry="9" />
            <ellipse cx="640" cy="248" rx="8" ry="5" />
            <ellipse cx="520" cy="468" rx="10" ry="6" />
            <ellipse cx="186" cy="538" rx="9" ry="5" />
          </g>
          {/* smudges and fingerprints */}
          <g filter={`url(#soft-${idPrefix})`} fill="#7C8A95" opacity="0.45">
            <ellipse cx="590" cy="520" rx="110" ry="54" />
            <ellipse cx="860" cy="430" rx="80" ry="46" />
            <ellipse cx="240" cy="440" rx="70" ry="40" />
            <ellipse cx="700" cy="180" rx="58" ry="30" />
          </g>
          <g stroke="#7A8792" strokeWidth="2.5" fill="none" opacity="0.22" filter={`url(#soft2-${idPrefix})`}>
            <path d="M760 420c-20-16-16-44 8-52 24-8 44 10 38 32-5 19-30 28-46 20Z" />
            <path d="M790 376c14 8 20 22 16 36" />
            <path d="M304 300c-14-10-10-30 6-35 16-5 30 7 26 22-4 13-20 19-32 13Z" />
          </g>
          <g filter={`url(#soft2-${idPrefix})`} fill="#6E7C87" opacity="0.3">
            <ellipse cx="740" cy="600" rx="130" ry="36" />
            <ellipse cx="420" cy="610" rx="100" ry="28" />
          </g>
          {/* dust specks */}
          <g fill="#6D7A84" opacity="0.22">
            {Array.from({ length: 40 }).map((_, index) => (
              <circle
                key={index}
                cx={80 + ((index * 173) % 1030)}
                cy={70 + ((index * 97) % 550)}
                r={index % 4 === 0 ? 2.2 : 1.1}
              />
            ))}
          </g>
        </g>
      ) : null}

      {/* frame */}
      <g>
        <rect x="52" y="42" width="1096" height="606" fill="none" stroke="#0B2545" strokeWidth="20" />
        <rect x="594" y="42" width="16" height="606" fill="#0B2545" />
        <rect x="52" y="342" width="1096" height="14" fill="#0B2545" />
        <rect x="52" y="342" width="1096" height="3" fill="#2C4F78" opacity="0.8" />
        <rect x="52" y="342" width="1096" height="2" fill="#FFFFFF" opacity="0.08" />
      </g>
      {/* sill */}
      <rect x="22" y="648" width="1156" height="26" fill="#12304F" />
      <rect x="22" y="648" width="1156" height="3" fill="#3B5C7C" />
      <rect x="0" y="674" width="1200" height="86" fill="#0B2545" />
      <rect x="0" y="674" width="1200" height="4" fill="#1E3E60" />
      <g fill="#FFFFFF" opacity="0.04">
        <rect x="120" y="690" width="290" height="2" />
        <rect x="640" y="700" width="360" height="2" />
      </g>
    </svg>
  );
}
