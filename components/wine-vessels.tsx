import type { VesselIcon } from '../content/wine';

/** Outline of each vessel in a 60×100 box; the wine fill is clipped to it. */
const outlines: Record<VesselIcon, { body: string; extra?: string; level: number }> = {
  // A stemmed bistro wine glass.
  verre: { body: 'M17 34c0 18 5 28 13 29 8-1 13-11 13-29z', extra: 'M30 63v27M20 94c4-3 16-3 20 0', level: 46 },
  // The pot lyonnais: a heavy-bottomed 46cl bottle with a short neck.
  pot: { body: 'M25 22h10v10c7 3 10 8 10 15v38c0 5-3 9-8 9H23c-5 0-8-4-8-9V47c0-7 3-12 10-15z', extra: 'M15 84h30M25 22h10', level: 52 },
  // A carafe with a narrow neck and wide body.
  carafe: { body: 'M25 20h10v22c10 6 16 15 16 28 0 15-9 24-21 24S9 85 9 70c0-13 6-22 16-28z', extra: 'M23 20c0-3 14-3 14 0', level: 62 },
  // A 75cl bottle with shoulders and a label.
  bouteille: { body: 'M26 2h8v24c7 4 10 9 10 15v49c0 3-2 5-5 5H21c-3 0-5-2-5-5V41c0-6 3-11 10-15z', extra: 'M18 56h24v22H18zM26 8h8', level: 44 },
};

/** Fine brass-line drawing of a wine measure: verre, pot lyonnais, carafe or bouteille. */
export function Vessel({ icon, uid, height = 64, className = '' }: {
  icon: VesselIcon;
  /** Unique per page, for the wine fill's clip path. */
  uid: string;
  height?: number;
  className?: string;
}) {
  const shape = outlines[icon];
  const clip = `vessel-${icon}-${uid}`;
  return (
    <svg className={`vessel ${className}`} viewBox="0 0 60 100" height={height} width={height * 0.6} aria-hidden="true" focusable="false">
      <defs><clipPath id={clip}><path d={shape.body} /></clipPath></defs>
      <rect className="vessel__wine" x="0" y={shape.level} width="60" height="100" clipPath={`url(#${clip})`} />
      <path d={shape.body} />
      {shape.extra ? <path d={shape.extra} /> : null}
    </svg>
  );
}
