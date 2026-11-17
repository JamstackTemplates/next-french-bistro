import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { PageHead } from '../../components/page-head';
import { Plaque } from '../../components/plaque';
import { WineList } from '../../components/wine-list';
import { Vessel } from '../../components/wine-vessels';
import { bistro } from '../../content/bistro';
import { formatPrice } from '../../content/menu';
import { cave, STYLES, winesByStyle } from '../../content/wine';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Wine',
  description: `Wines by the verre, the pot lyonnais, the carafe and the bottle, and a sans alcool list, at ${bistro.name}.`,
  alternates: { canonical: absoluteUrl('/wine/') },
};

export default function WinePage() {
  const groups = winesByStyle();
  return (
    <>
      <PageHead eyebrow="La cave" title={<>Wine <span className="text-accent">by the measure</span></>}>
        <p>Poured by the glass, the pot lyonnais, the carafe or the bottle. Wines show prices only under the measures we pour them in. 21+ with ID.</p>
      </PageHead>

      <div className="wrap">
        {/* The measures, drawn side by side. */}
        <section aria-labelledby="measures-title" className="grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="measures-title" className="sr-only">The measures</h2>
            <ul className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] items-end gap-x-3 border-b border-rule pb-5" style={{ '--cols': cave.measures.length } as CSSProperties}>
              {cave.measures.map(measure => (
                <li key={measure.id} className="grid justify-items-center gap-2 text-center">
                  <Vessel icon={measure.icon} uid={`big-${measure.id}`} height={130} className="max-sm:h-24" />
                  <span className="font-display text-[1.2rem] leading-tight" lang="fr">{measure.label}</span>
                  <span className="tabular text-[.85rem] text-muted">{measure.volume}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside aria-labelledby="pour-title" className="border-l-2 border-brass pl-5">
            <h2 id="pour-title" className="text-[1.6rem]">How we pour</h2>
            {cave.howWePour.map(paragraph => <p key={paragraph} className="mt-3 text-[.98rem] text-muted">{paragraph}</p>)}
          </aside>
        </section>

        {groups.map((group, index) => (
          <section key={group.style} id={group.style === 'rosé' ? 'rose' : group.style} className="pt-[clamp(3rem,6vw,4.5rem)]" aria-labelledby={`style-${index}-title`}>
            <header className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-3">
              <Plaque id={`style-${index}-title`} tab={String(index + 1)}><span lang="fr">{STYLES[group.style].title}</span></Plaque>
              <p className="pb-1 font-display text-[1.15rem] text-muted">{STYLES[group.style].subtitle}</p>
            </header>
            <WineList wines={group.wines} uid={`style-${index}`} anchors />
          </section>
        ))}

        <section id="sans-alcool" className="pt-[clamp(3rem,6vw,4.5rem)]" aria-labelledby="sans-alcool-title">
          <header className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-3">
            <Plaque id="sans-alcool-title" tab={String(groups.length + 1)}><span lang="fr">Sans alcool</span></Plaque>
            <p className="pb-1 font-display text-[1.15rem] text-muted">Non-alcoholic</p>
          </header>
          <ul className="columns-1 gap-x-14 [column-rule:1px_solid_var(--line)] md:columns-2">
            {cave.sansAlcool.map(drink => (
              <li key={drink.id} id={drink.id} className="break-inside-avoid border-b border-dotted border-line py-3.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="dish-name font-sans text-[1.12rem]" lang="fr">{drink.name}</h3>
                  <span className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-rule" aria-hidden="true" />
                  <span className="tabular font-semibold">{formatPrice(drink.price)}</span>
                </div>
                <p className="mt-0.5 text-[.96rem] text-muted italic">{drink.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 border-t border-line pt-6 text-[.92rem] text-muted">
          We serve alcohol to guests 21 and over; please bring ID. Enjoy it slowly, with food, and ask for water any time.
        </p>
      </div>
    </>
  );
}
