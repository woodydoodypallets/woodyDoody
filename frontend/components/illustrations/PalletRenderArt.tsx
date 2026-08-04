export default function PalletRenderArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prDeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFC989" />
          <stop offset="100%" stopColor="#C99552" />
        </linearGradient>
        <linearGradient id="prEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B27F3E" />
          <stop offset="100%" stopColor="#95692F" />
        </linearGradient>
        <linearGradient id="prBlock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#6E4A2E" />
        </linearGradient>
      </defs>

      <ellipse cx="250" cy="178" rx="215" ry="13" fill="#0B1210" opacity="0.18" />

      {/* stringer blocks (feet), drawn first so deck sits above the gap */}
      <rect x="48" y="88" width="66" height="58" rx="4" fill="url(#prBlock)" />
      <rect x="217" y="88" width="66" height="58" rx="4" fill="url(#prBlock)" />
      <rect x="386" y="88" width="66" height="58" rx="4" fill="url(#prBlock)" />

      {/* deck edge / board thickness band */}
      <path d="M20 60 L480 60 L480 90 L20 90 Z" fill="url(#prEdge)" />

      {/* top deck surface (slight trapezoid = gentle top-down perspective) */}
      <path d="M60 8 L440 8 L480 60 L20 60 Z" fill="url(#prDeck)" />

      {/* plank dividers */}
      <line x1="136" y1="8" x2="112" y2="60" stroke="#8B6239" strokeOpacity="0.55" strokeWidth="2.5" />
      <line x1="212" y1="8" x2="204" y2="60" stroke="#8B6239" strokeOpacity="0.55" strokeWidth="2.5" />
      <line x1="288" y1="8" x2="296" y2="60" stroke="#8B6239" strokeOpacity="0.55" strokeWidth="2.5" />
      <line x1="364" y1="8" x2="388" y2="60" stroke="#8B6239" strokeOpacity="0.55" strokeWidth="2.5" />

      {/* subtle wood-grain highlights */}
      <line x1="72" y1="30" x2="118" y2="30" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="150" y1="24" x2="196" y2="24" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1.5" />
      <line x1="310" y1="26" x2="352" y2="26" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1.5" />
      <line x1="390" y1="32" x2="428" y2="32" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" />

      {/* outline for crispness */}
      <path d="M60 8 L440 8 L480 60 L20 60 Z" fill="none" stroke="#0B1210" strokeOpacity="0.08" strokeWidth="2" />
    </svg>
  );
}
