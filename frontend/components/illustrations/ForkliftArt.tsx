export default function ForkliftArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 340" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fkGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F2A900" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F2A900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fkCrate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2A900" />
          <stop offset="100%" stopColor="#C97F00" />
        </linearGradient>
      </defs>
      <circle cx="210" cy="140" r="160" fill="url(#fkGlow)" />
      <rect x="0" y="270" width="420" height="4" fill="#F2A900" opacity="0.4" />
      <ellipse cx="220" cy="300" rx="150" ry="16" fill="#0B1210" opacity="0.35" />

      {/* mast + lifted load */}
      <rect x="150" y="60" width="7" height="170" fill="#1E2C26" />
      <rect x="178" y="60" width="7" height="170" fill="#1E2C26" />
      <rect x="150" y="60" width="35" height="8" fill="#F2A900" />

      <g transform="translate(120 95)">
        <rect x="0" y="52" width="86" height="14" rx="2" fill="#8a6a44" />
        <rect x="4" y="30" width="78" height="12" rx="2" fill="#8a6a44" />
        <rect x="4" y="-38" width="78" height="66" rx="5" fill="url(#fkCrate)" />
        <rect x="4" y="-38" width="78" height="14" rx="4" fill="#0B1210" opacity="0.12" />
      </g>

      {/* body */}
      <g transform="translate(150 195)">
        <rect x="0" y="0" width="150" height="60" rx="10" fill="#16211D" />
        <rect x="10" y="8" width="60" height="34" rx="5" fill="#24352d" />
        <rect x="10" y="8" width="60" height="34" rx="5" fill="none" stroke="#F2A900" strokeOpacity="0.3" strokeWidth="2" />
        <rect x="130" y="-8" width="26" height="76" rx="5" fill="#C1440E" />
        <circle cx="35" cy="70" r="24" fill="#0B1210" />
        <circle cx="35" cy="70" r="9" fill="#3a4a43" />
        <circle cx="120" cy="70" r="24" fill="#0B1210" />
        <circle cx="120" cy="70" r="9" fill="#3a4a43" />
      </g>

      {/* forks */}
      <rect x="95" y="248" width="60" height="8" fill="#B9C4BC" />
      <rect x="95" y="262" width="60" height="8" fill="#B9C4BC" />
    </svg>
  );
}
