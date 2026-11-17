/** A bentwood bistro chair beside a little round café table, in ink line. */
export function BistroChair({ className = '' }: { className?: string }) {
  return (
    <svg className={`line-art ${className}`} viewBox="0 0 240 220" aria-hidden="true" focusable="false">
      {/* Chair: a looped bentwood back, round seat, splayed legs and a leg ring */}
      <path d="M42 112c-10-34-8-78 14-90 22-12 40 10 36 46l-6 44" />
      <path d="M50 110c-6-28-4-62 10-72 14-10 26 6 24 32l-4 40" />
      <path d="M58 46c4 20 6 42 6 64M70 40c2 22 2 46 0 70" opacity=".6" />
      <ellipse cx="66" cy="114" rx="34" ry="9" fill="var(--art-fill)" />
      <path d="M40 120l-8 88M92 120l10 88M56 122l-2 88M78 122l4 86" />
      <ellipse cx="67" cy="168" rx="28" ry="6" />
      {/* Café table: round top, cast-iron pedestal and tripod foot */}
      <ellipse cx="172" cy="104" rx="48" ry="11" fill="var(--art-fill)" />
      <path d="M124 104v4c0 6 22 11 48 11s48-5 48-11v-4" />
      <path d="M168 119v64h8v-64" />
      <path d="M172 183c-12 6-24 16-30 26M172 183c12 6 24 16 30 26M172 183v26" />
      {/* A carafe and a glass on the table */}
      <path d="M160 92c0-10-6-12-6-22 0-4 2-6 2-12h8c0 6 2 8 2 12 0 10-6 12-6 22z" stroke="var(--brass)" />
      <path d="M186 80c0 8 2 12 6 12s6-4 6-12zM192 92v8M187 100h10" stroke="var(--brass)" />
    </svg>
  );
}
