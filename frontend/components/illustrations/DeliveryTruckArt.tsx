export default function DeliveryTruckArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dtGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F2A900" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F2A900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dtCrate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2A900" />
          <stop offset="100%" stopColor="#C97F00" />
        </linearGradient>
      </defs>
      <circle cx="230" cy="120" r="170" fill="url(#dtGlow)" />
      <rect x="0" y="240" width="460" height="4" fill="#F2A900" opacity="0.4" />
      <ellipse cx="230" cy="264" rx="190" ry="14" fill="#0B1210" opacity="0.35" />

      {/* trailer body */}
      <rect x="40" y="70" width="260" height="150" rx="8" fill="#16211D" />
      <rect x="40" y="70" width="260" height="150" rx="8" fill="none" stroke="#F2A900" strokeOpacity="0.15" strokeWidth="2" />

      {/* cargo visible through open doors */}
      <rect x="58" y="150" width="70" height="60" rx="4" fill="url(#dtCrate)" />
      <rect x="136" y="130" width="70" height="80" rx="4" fill="#24352d" />
      <rect x="136" y="130" width="70" height="14" fill="#F2A900" opacity="0.6" />
      <rect x="214" y="160" width="66" height="50" rx="4" fill="#C1440E" />

      {/* cab */}
      <path d="M300 130 L360 130 L385 165 L385 220 L300 220 Z" fill="#1E2C26" />
      <path d="M310 138 L352 138 L370 165 L310 165 Z" fill="#24352d" opacity="0.8" />
      <rect x="300" y="185" width="85" height="10" fill="#0B1210" opacity="0.3" />

      {/* wheels */}
      <circle cx="100" cy="222" r="22" fill="#0B1210" />
      <circle cx="100" cy="222" r="9" fill="#3a4a43" />
      <circle cx="220" cy="222" r="22" fill="#0B1210" />
      <circle cx="220" cy="222" r="9" fill="#3a4a43" />
      <circle cx="345" cy="222" r="22" fill="#0B1210" />
      <circle cx="345" cy="222" r="9" fill="#3a4a43" />

      {/* motion lines */}
      <g stroke="#F2A900" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round">
        <line x1="405" y1="140" x2="445" y2="140" />
        <line x1="400" y1="160" x2="430" y2="160" />
        <line x1="405" y1="180" x2="440" y2="180" />
      </g>
    </svg>
  );
}
