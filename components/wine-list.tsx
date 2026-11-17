import type { CSSProperties } from 'react';
import { formatPrice } from '../content/menu';
import { cave, type Measure, type Wine } from '../content/wine';
import { Vessel } from './wine-vessels';

/**
 * Wines with their prices aligned under the measure vessels (verre, pot lyonnais, carafe, bouteille).
 * A wine only shows prices for the measures it's poured in. `uid` keeps the vessel drawings' ids unique.
 */
export function WineList({ wines, measures = cave.measures, uid, vessels = true, anchors = false }: {
  wines: readonly Wine[];
  measures?: readonly Measure[];
  uid: string;
  /** Give each wine an id, for links such as /wine/#cuvee-du-zinc. One list per page only. */
  anchors?: boolean;
  /** Draw the small vessels in the header row. */
  vessels?: boolean;
}) {
  const columns = { '--cols': measures.length } as CSSProperties;
  const grid = 'grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-2 md:grid-cols-[minmax(0,1fr)_repeat(var(--cols),5.5rem)]';
  return (
    <div style={columns}>
      <div className={`${grid} items-end border-b border-rule pb-2`} aria-hidden="true">
        <span className="max-md:hidden" />
        {measures.map(measure => (
          <span key={measure.id} className="grid justify-items-center gap-1 text-center">
            {vessels ? <Vessel icon={measure.icon} uid={`${uid}-${measure.id}`} height={46} /> : null}
            <span className="text-[.74rem] leading-tight font-semibold tracking-[.1em] uppercase" lang="fr">{measure.label}</span>
            <span className="tabular text-[.74rem] text-muted">{measure.volume}</span>
          </span>
        ))}
      </div>
      <ul>
        {wines.map(wine => (
          <li key={wine.id} id={anchors ? wine.id : undefined} data-sold-out={Boolean(wine.soldOut)}
            className={`${grid} carte-row items-baseline gap-y-2 border-b border-dotted border-line py-4`}>
            <div className="col-span-full md:col-span-1">
              <h3 className="dish-name font-sans text-[1.12rem] leading-snug">
                {wine.soldOut ? <s className="decoration-accent">{wine.name}</s> : wine.name}
                {wine.soldOut ? <span className="ml-2 text-[.72rem] tracking-[.14em] text-accent uppercase" style={{ fontVariantCaps: 'normal' }}>· sold out</span> : null}
              </h3>
              <p className="text-[.95rem]">
                <span className="font-display text-[1.02rem]" lang="fr">{wine.appellation}</span>
                <span className="text-muted"> · {wine.region} · {wine.grapes.join(', ')}</span>
              </p>
              <p className="carte-desc mt-0.5 text-[.94rem] text-muted italic">{wine.notes}</p>
            </div>
            {measures.map(measure => {
              const price = wine.prices[measure.id];
              return (
                <span key={measure.id} className="carte-price tabular text-center font-semibold">
                  {price !== undefined ? (
                    <><span className="sr-only">{measure.label} ({measure.volume}): </span>{formatPrice(price)}</>
                  ) : (
                    <span className="font-normal text-rule" aria-hidden="true">–</span>
                  )}
                </span>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
