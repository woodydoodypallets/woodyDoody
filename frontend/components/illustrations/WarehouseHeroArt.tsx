export default function WarehouseHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 460" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="whGlow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#F2A900" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#F2A900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="whBuilding" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E2C26" />
          <stop offset="100%" stopColor="#16211D" />
        </linearGradient>
        <linearGradient id="whCrateFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2A900" />
          <stop offset="100%" stopColor="#C97F00" />
        </linearGradient>
        <linearGradient id="whFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1210" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B1210" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <circle cx="330" cy="150" r="220" fill="url(#whGlow)" />

      {/* warehouse silhouette */}
      <path d="M40 260 L40 130 L170 70 L300 130 L300 260 Z" fill="url(#whBuilding)" />
      <rect x="70" y="160" width="46" height="60" rx="3" fill="#0B1210" opacity="0.55" />
      <rect x="140" y="160" width="46" height="60" rx="3" fill="#0B1210" opacity="0.55" />
      <rect x="210" y="160" width="46" height="60" rx="3" fill="#0B1210" opacity="0.55" />
      <path d="M40 130 L170 70 L300 130 L300 145 L170 88 L40 145 Z" fill="#F2A900" opacity="0.85" />

      {/* second building block, larger warehouse to the right */}
      <rect x="330" y="120" width="260" height="140" fill="url(#whBuilding)" />
      <rect x="330" y="120" width="260" height="14" fill="#F2A900" opacity="0.6" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={352 + i * 40} y="150" width="22" height="34" rx="2" fill="#0B1210" opacity="0.5" />
      ))}
      <rect x="352" y="205" width="230" height="55" rx="3" fill="#0B1210" opacity="0.35" />

      {/* ground */}
      <rect x="0" y="260" width="640" height="6" fill="#F2A900" opacity="0.5" />
      <rect x="0" y="266" width="640" height="130" fill="url(#whFloor)" />
      <g opacity="0.18" stroke="#F2A900" strokeWidth="1">
        <line x1="0" y1="300" x2="640" y2="300" />
        <line x1="0" y1="335" x2="640" y2="335" />
        <line x1="0" y1="370" x2="640" y2="370" />
      </g>

      {/* pallet stack, left */}
      <g transform="translate(70 300)">
        <ellipse cx="45" cy="96" rx="55" ry="10" fill="#0B1210" opacity="0.4" />
        <rect x="0" y="70" width="90" height="10" rx="2" fill="#8a6a44" />
        <rect x="0" y="70" width="90" height="10" rx="2" fill="#6E4A2E" opacity="0.4" />
        {[0, 16, 32].map((y) => (
          <rect key={y} x="4" y={30 + y} width="82" height="8" rx="1.5" fill="#8a6a44" />
        ))}
        <rect x="6" y="0" width="78" height="34" rx="3" fill="url(#whCrateFace)" />
        <rect x="6" y="0" width="78" height="8" rx="2" fill="#0B1210" opacity="0.12" />
      </g>

      {/* forklift, center */}
      <g transform="translate(280 262)">
        <ellipse cx="90" cy="110" rx="80" ry="12" fill="#0B1210" opacity="0.4" />
        {/* mast */}
        <rect x="4" y="0" width="6" height="95" fill="#1E2C26" />
        <rect x="24" y="0" width="6" height="95" fill="#1E2C26" />
        {/* lifted pallet + crates */}
        <rect x="-6" y="26" width="46" height="8" rx="1.5" fill="#8a6a44" />
        <rect x="-2" y="4" width="38" height="22" rx="2" fill="url(#whCrateFace)" />
        {/* body */}
        <rect x="20" y="60" width="90" height="34" rx="6" fill="#16211D" />
        <rect x="26" y="66" width="34" height="20" rx="3" fill="#24352d" />
        <rect x="98" y="50" width="16" height="44" rx="3" fill="#C1440E" />
        {/* wheels */}
        <circle cx="42" cy="100" r="14" fill="#0B1210" />
        <circle cx="42" cy="100" r="5" fill="#3a4a43" />
        <circle cx="94" cy="100" r="14" fill="#0B1210" />
        <circle cx="94" cy="100" r="5" fill="#3a4a43" />
        {/* forks */}
        <rect x="-10" y="88" width="34" height="5" fill="#B9C4BC" />
        <rect x="-10" y="98" width="34" height="5" fill="#B9C4BC" />
      </g>

      {/* pallet stack, right */}
      <g transform="translate(500 310)">
        <ellipse cx="45" cy="86" rx="55" ry="10" fill="#0B1210" opacity="0.4" />
        <rect x="0" y="60" width="90" height="10" rx="2" fill="#8a6a44" />
        {[0, 16].map((y) => (
          <rect key={y} x="4" y={22 + y} width="82" height="8" rx="1.5" fill="#8a6a44" />
        ))}
        <rect x="6" y="-24" width="34" height="46" rx="3" fill="url(#whCrateFace)" />
        <rect x="46" y="-14" width="38" height="36" rx="3" fill="#C1440E" />
      </g>
    </svg>
  );
}
