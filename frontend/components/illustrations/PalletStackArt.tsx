export default function PalletStackArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="psGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F2A900" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F2A900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="psCrate1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2A900" />
          <stop offset="100%" stopColor="#C97F00" />
        </linearGradient>
        <linearGradient id="psPlank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3814f" />
          <stop offset="100%" stopColor="#7c5c37" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="150" r="170" fill="url(#psGlow)" />

      <ellipse cx="200" cy="330" rx="130" ry="18" fill="#0B1210" opacity="0.35" />

      {/* pallet base */}
      <g transform="translate(60 250)">
        <rect x="0" y="26" width="280" height="16" rx="3" fill="url(#psPlank)" />
        {[0, 20, 40].map((y) => (
          <rect key={y} x="6" y={y} width="268" height="14" rx="2" fill="url(#psPlank)" />
        ))}
        {[10, 130, 250].map((x) => (
          <rect key={x} x={x} y="0" width="20" height="42" rx="2" fill="#5c4128" />
        ))}
      </g>

      {/* stacked crates */}
      <rect x="80" y="150" width="110" height="96" rx="6" fill="url(#psCrate1)" />
      <rect x="80" y="150" width="110" height="18" rx="4" fill="#0B1210" opacity="0.12" />
      <rect x="80" y="150" width="110" height="96" rx="6" fill="none" stroke="#0B1210" strokeOpacity="0.1" strokeWidth="2" />

      <rect x="205" y="120" width="115" height="126" rx="6" fill="#16211D" />
      <rect x="205" y="120" width="115" height="18" rx="4" fill="#F2A900" opacity="0.7" />
      <rect x="222" y="160" width="80" height="10" rx="2" fill="#B9C4BC" opacity="0.3" />
      <rect x="222" y="180" width="55" height="10" rx="2" fill="#B9C4BC" opacity="0.3" />

      <rect x="95" y="96" width="70" height="58" rx="5" fill="#C1440E" />
      <rect x="95" y="96" width="70" height="12" rx="3" fill="#0B1210" opacity="0.15" />
    </svg>
  );
}
