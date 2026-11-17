'use client';

import { useState } from 'react';
import { DIETS, formatPrice, menu } from '../content/menu';
import { CARTE_FILTERS, matchesAll, type CarteFilter } from '../lib/menu-filter';
import { CarteRow, DietMarks } from './carte-row';
import { Plaque } from './plaque';

/**
 * The full carte under its enamel plaques, two columns per section. The complete carte is in the static
 * HTML; the filters are a progressive enhancement that only hide dishes that don't match.
 */
export function Carte() {
  const [filters, setFilters] = useState<CarteFilter[]>([]);
  const toggle = (id: CarteFilter) =>
    setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const visible = menu.sections.map(section => section.dishes.filter(dish => matchesAll(dish, filters)));
  const total = visible.reduce((sum, dishes) => sum + dishes.length, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-3.5 print:hidden">
        <nav className="scrollbar-none flex max-w-full gap-x-4 gap-y-1 overflow-x-auto text-[.95rem]" aria-label="Carte sections">
          {menu.sections.map(section => (
            <a key={section.id} href={`#${section.id}`} className="py-1 font-semibold whitespace-nowrap text-ink no-underline hover:text-accent hover:underline" lang="fr">{section.title}</a>
          ))}
        </nav>
        <div className="scrollbar-none flex max-w-full items-center gap-2 overflow-x-auto p-0.5 sm:ml-auto" role="group" aria-label="Show only">
          <span className="pr-1 text-[.85rem] font-semibold whitespace-nowrap text-muted">Show only</span>
          {CARTE_FILTERS.map(filter => (
            <button key={filter.id} type="button" className="filter" aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
              {filter.label}
            </button>
          ))}
          {filters.length ? <button type="button" className="filter border-dashed text-muted" onClick={() => setFilters([])}>Clear</button> : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{filters.length ? `${total} dishes match.` : ''}</p>
      </div>

      {menu.sections.map((section, index) => (
        <section key={section.id} id={section.id} className="pt-[clamp(2.5rem,5vw,3.75rem)]" aria-labelledby={`${section.id}-title`}>
          <header className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
            <Plaque id={`${section.id}-title`} tab={String(index + 1)}><span lang="fr">{section.title}</span></Plaque>
            <p className="max-w-[36rem] pb-1 text-muted">
              <span className="font-display text-[1.15rem] text-ink">{section.subtitle}.</span> {section.description}
            </p>
          </header>
          {!visible[index].length ? (
            <p className="border border-dashed border-rule p-5 text-muted">Nothing here matches those filters. Ask us: the kitchen can often adapt a dish.</p>
          ) : section.compact ? (
            <ul className="grid gap-x-10 border-y border-line sm:grid-cols-2 lg:grid-cols-3">
              {visible[index].map(dish => (
                <li key={dish.id} id={dish.id} className="flex items-baseline gap-2 border-b border-dotted border-line py-2.5">
                  <span className="dish-name" lang="fr">{dish.name}</span>
                  <DietMarks dish={dish} />
                  <span className="text-[.88rem] text-muted italic max-sm:hidden">{dish.description}</span>
                  <span className="min-w-3 flex-1 -translate-y-1 border-b border-dotted border-rule" aria-hidden="true" />
                  <span className="tabular font-semibold">{formatPrice(dish.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="columns-1 gap-x-14 [column-rule:1px_solid_var(--line)] md:columns-2">
              {visible[index].map(dish => <CarteRow key={dish.id} dish={dish} />)}
            </ul>
          )}
        </section>
      ))}

      <aside className="mt-12 grid gap-3 border-t border-line pt-6 text-[.92rem] text-muted" aria-label="Notes">
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(DIETS).map(([id, diet]) => (
            <span key={id} className="inline-flex items-center gap-1.5"><span className={`mark mark-${id}`} aria-hidden="true">{diet.short}</span>{diet.label}</span>
          ))}
        </p>
        {menu.notes.map(note => <p key={note}>{note}</p>)}
      </aside>
    </div>
  );
}
