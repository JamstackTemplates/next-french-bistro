/**
 * Le lampadaire: a generic cast-iron street lamp in ink line. Its lantern glows only in dark mode
 * (--lamp-on), flickering on once (see tailwind.input.css).
 */
export function StreetLamp({ className = '' }: { className?: string }) {
  return (
    <svg className={`lamp ${className}`} viewBox="0 0 120 420" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lamp-glow-gradient">
          <stop offset="0" stopColor="var(--lamp-light)" stopOpacity=".75" />
          <stop offset=".35" stopColor="var(--lamp-light)" stopOpacity=".28" />
          <stop offset="1" stopColor="var(--lamp-light)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="lamp__glow" cx="60" cy="58" r="120" fill="url(#lamp-glow-gradient)" />
      {/* Lantern */}
      <path className="lamp__iron" d="M56 6h8l2 8H54z" />
      <path className="lamp__iron" d="M38 22h44l-6 8H44z" />
      <path className="lamp__glass" d="M44 30h32l-5 52H49z" />
      <path className="lamp__glow" d="M47 34h26l-4 44H51z" fill="var(--lamp-light)" />
      <path d="M60 30v52" stroke="var(--lamp-iron)" strokeWidth="1.5" />
      <path className="lamp__iron" d="M46 82h28v6H46zM52 88h16l-3 10H55z" />
      {/* Post with collars and a scrolled bracket */}
      <path className="lamp__iron" d="M56 98h8v260h-8z" />
      <path className="lamp__iron" d="M52 140h16v6H52zM52 250h16v6H52z" />
      <path d="M64 120c14 0 18 10 12 16-4 4-10 0-8-4M56 120c-14 0-18 10-12 16 4 4 10 0 8-4" fill="none" stroke="var(--lamp-iron)" strokeWidth="3" strokeLinecap="round" />
      {/* Fluted base */}
      <path className="lamp__iron" d="M50 356h20l6 30H44z" />
      <path className="lamp__iron" d="M38 386h44v10H38zM32 396h56v12H32z" />
    </svg>
  );
}
