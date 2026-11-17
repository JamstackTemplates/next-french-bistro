/**
 * The black-and-white cabochon mosaic floor: white octagons with small black diamonds between them.
 * Used only as the footer's floor and the 404's background. `id` must be unique on the page.
 */
export function MosaicFloor({ id, className = '' }: { id: string; className?: string }) {
  return (
    <svg className={`floor ${className}`} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse">
          <rect className="floor__black" width="26" height="26" />
          <path className="floor__white" d="M6 .8h14L25.2 6v14L20 25.2H6L.8 20V6z" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
