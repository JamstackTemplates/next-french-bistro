/**
 * The room reflected very faintly in the mirror: the arched front window, the globe lamps along the
 * ceiling, and the backs of bentwood chairs. Drawn in currentColor (--reflection), behind the writing.
 */
export function MirrorReflection() {
  return (
    <svg className="mirror__reflection" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M250 520V200c0-50 30-80 70-80s70 30 70 80v320" />
        <path d="M320 120v400M250 300h140M250 400h140" />
        <path d="M60 470c-8-26-6-58 10-66 16-8 28 8 26 34l-4 32M150 480c-8-26-6-58 10-66 16-8 28 8 26 34l-4 32" />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="40" r="7" /><circle cx="150" cy="30" r="7" /><circle cx="240" cy="34" r="7" />
      </g>
    </svg>
  );
}
