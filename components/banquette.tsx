/** The tufted oxblood leather banquette under the mirror. Decorative. */
export function Banquette({ className = '' }: { className?: string }) {
  const tufts = Array.from({ length: 13 }, (_, i) => 30 + i * 45);
  return (
    <svg className={`banquette ${className}`} viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 22C0 10 8 6 20 6h560c12 0 20 4 20 16v42H0z" fill="var(--banquette)" />
      <path d="M0 22C0 10 8 6 20 6h560c12 0 20 4 20 16" fill="none" stroke="var(--banquette-light)" strokeWidth="3" />
      {tufts.map(x => <path key={x} d={`M${x + 22} 12v52`} stroke="var(--banquette-dark)" strokeWidth="1.5" opacity=".7" />)}
      {tufts.map(x => <circle key={x} cx={x} cy="30" r="2.2" fill="var(--banquette-dark)" />)}
      <path d="M0 50h600" stroke="var(--banquette-dark)" strokeWidth="2" opacity=".6" />
    </svg>
  );
}
