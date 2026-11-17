import type { ReactNode } from 'react';
import type { DishArt as Art } from '../content/menu';

/**
 * Fine line drawings for featured dishes: a cocotte, a steak-frites plate, a crème brûlée ramekin,
 * a cheese board, an onion-soup bowl and a tart. Ink line on the tablecloth, coloured by tokens.
 */
const drawings: Record<Art, ReactNode> = {
  cocotte: (
    <>
      <path className="fill" d="M22 44h76v20c0 12-8 18-18 18H40c-10 0-18-6-18-18z" />
      <path d="M22 52h76" />
      <path d="M22 50h-8a4 4 0 0 0 0 8h8M98 50h8a4 4 0 0 1 0 8h-8" />
      <path className="fill" d="M16 44c10-14 78-14 88 0z" />
      <path className="fill" d="M54 34c0-5 12-5 12 0v2H54z" />
      <path className="brass" d="M44 24c-4-5 4-8 0-14M60 20c-4-5 4-8 0-14M76 24c-4-5 4-8 0-14" />
      <path d="M30 86h60" opacity=".5" />
    </>
  ),
  'steak-frites': (
    <>
      <ellipse className="fill" cx="60" cy="56" rx="54" ry="26" />
      <ellipse cx="60" cy="56" rx="42" ry="18" opacity=".6" />
      <path className="food" d="M30 52c2-10 18-14 30-10 8 3 12 10 6 16-8 8-30 8-36-6z" />
      <path d="M30 52c2-10 18-14 30-10 8 3 12 10 6 16-8 8-30 8-36-6zM38 50l14 6M42 46l14 6" />
      <rect className="fill" x="44" y="44" width="9" height="6" rx="1.5" transform="rotate(-8 48 47)" />
      <path className="brass" d="M70 40l14 20M75 38l12 22M80 38l9 22M85 39l6 20M72 46l18 12M88 40l-2 22" />
      <path d="M76 66c4-6 12-6 16-2-4 2-6 6-16 2zM84 70c4-4 10-3 12 0-4 2-8 3-12 0z" />
    </>
  ),
  ramekin: (
    <>
      <path className="fill" d="M24 40h72l-6 34c-1 5-4 8-9 8H39c-5 0-8-3-9-8z" />
      <path d="M36 42l2 38M48 42l1 40M60 42v40M72 42l-1 40M84 42l-2 38" opacity=".55" />
      <ellipse className="fill" cx="60" cy="40" rx="36" ry="8" />
      <ellipse className="food" cx="60" cy="40" rx="30" ry="5.5" />
      <path className="brass" d="M44 38l6 3 5-4 7 4 6-3 6 3" />
      <path d="M92 20l-22 22M96 16a4 4 0 1 1-5 5" />
    </>
  ),
  'cheese-board': (
    <>
      <path className="fill" d="M12 52c0-6 4-10 10-10h70c6 0 10 4 10 10v14c0 6-4 10-10 10H22c-6 0-10-4-10-10z" />
      <path d="M102 58h10a4 4 0 0 1 0 8h-10" />
      <path className="food" d="M22 64l22-20 6 20z" />
      <path d="M22 64l22-20 6 20zM28 64v-4M34 64v-6" />
      <ellipse className="fill" cx="62" cy="58" rx="10" ry="7" />
      <path d="M52 58v4c0 4 4 7 10 7s10-3 10-7v-4" />
      <path className="fill" d="M76 66l18-16 2 16z" />
      <path d="M81 62h.1M86 58h.1M90 63h.1M88 55h.1" strokeWidth="2.4" />
      <circle className="brass" cx="38" cy="36" r="3.5" /><circle className="brass" cx="44" cy="33" r="3.5" /><circle className="brass" cx="41" cy="28" r="3.5" />
      <path d="M44 22c2-3 6-4 8-2" />
    </>
  ),
  bowl: (
    <>
      <path className="fill" d="M22 46h76c0 20-16 34-38 34S22 66 22 46z" />
      <path d="M22 50c-8-4-12 4-6 8M98 50c8-4 12 4 6 8" />
      <path className="food" d="M20 46c4-8 12-6 16-10 6 4 10-2 16 0 6-4 10 2 16-2 6 4 12-2 16 4 6-2 10 4 14 8z" />
      <path d="M20 46c4-8 12-6 16-10 6 4 10-2 16 0 6-4 10 2 16-2 6 4 12-2 16 4 6-2 10 4 14 8" />
      <path d="M34 42h.1M50 39h.1M66 40h.1M82 42h.1" strokeWidth="2.6" />
      <path className="brass" d="M48 26c-4-5 4-8 0-14M64 24c-4-5 4-8 0-14" />
      <path d="M44 84h32" opacity=".5" />
    </>
  ),
  tart: (
    <>
      <ellipse className="fill" cx="60" cy="58" rx="50" ry="22" />
      <ellipse className="food" cx="58" cy="54" rx="38" ry="15" />
      <path d="M58 54m-38 0a38 15 0 1 0 76 0a38 15 0 1 0-76 0" />
      <path d="M30 50c6-6 16-6 20 0M50 46c6-5 16-5 20 0M70 50c5-5 14-4 16 2M34 60c6-5 16-5 20 0M56 62c6-5 16-5 20 0" />
      <path className="fill" d="M86 40c0-6 10-8 14-4 4-2 8 2 6 6 2 4-4 7-10 6-6 1-10-3-10-8z" />
      <path className="brass" d="M100 30l6-6" />
    </>
  ),
};

export function DishArt({ art, size = 96, className = '' }: { art: Art; size?: number; className?: string }) {
  return (
    <svg className={`dish-art ${className}`} viewBox="0 0 120 92" width={size} height={size * 92 / 120} aria-hidden="true" focusable="false">
      {drawings[art]}
    </svg>
  );
}
