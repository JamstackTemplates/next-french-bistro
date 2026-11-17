import type { CSSProperties } from 'react';
import { formatPrice, menu, mirror, resolveMirrorDish, type MirrorDish, type ResolvedMirrorDish } from '../content/menu';
import { menuAnchor } from '../lib/paths';
import { Banquette } from './banquette';
import { MirrorHeading } from './mirror-heading';
import { MirrorReflection } from './mirror-reflection';
import { ServiceStatus } from './service-status';
import { SiteLink } from './site-link';

const line = (n: number) => ({ '--line': n }) as CSSProperties;

function resolve(dish: MirrorDish): ResolvedMirrorDish {
  // tests/content.test.ts guarantees every mirror id exists on the carte.
  return resolveMirrorDish(dish) ?? { name: '', description: '', price: 0 };
}

function DishName({ dish }: { dish: ResolvedMirrorDish }) {
  return dish.id ? <SiteLink href={menuAnchor(dish.id)} className="mirror__link">{dish.name}</SiteLink> : <>{dish.name}</>;
}

/** A hand-drawn rule in white pencil. */
function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 14" width="240" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M4 8c30-6 60 4 92-1 10-2 14-6 24-6s14 4 24 6c32 5 62-5 92 1" />
      <path d="M118 7c1 2 3 2 4 0" />
    </svg>
  );
}

const dishes = () => [
  { label: 'Entrée du jour', dish: resolve(mirror.entreeDuJour), plat: false },
  { label: 'Plat du jour', dish: resolve(mirror.platDuJour), plat: true },
  { label: 'Dessert du jour', dish: resolve(mirror.dessertDuJour), plat: false },
];

/**
 * The hero: today's menu hand-lettered in white on an antique bistro mirror in a brass frame, above the
 * banquette. All of it comes from `mirror` and `formules` in content/menu.ts; the heading and the service
 * status are worked out in the browser (see MirrorHeading and ServiceStatus).
 */
export function MirrorMenu() {
  return (
    <figure className="m-0" aria-labelledby="mirror-title">
      <div className="mirror">
        <div className="mirror__glass mirror__text px-[clamp(1.25rem,4.5vw,3.25rem)] pt-[clamp(2.75rem,5.5vw,4rem)] pb-[clamp(1.25rem,3vw,2rem)]">
          <MirrorReflection />
          <h2 id="mirror-title" className="write-in text-center font-normal" style={line(0)} lang="fr">
            <MirrorHeading date={mirror.date} className="block text-[clamp(2.7rem,5.4vw,4rem)]" />
          </h2>

          <dl className="mt-[clamp(.75rem,2vw,1.25rem)] grid gap-[clamp(.8rem,1.8vw,1.15rem)]">
            {dishes().map(({ label, dish, plat }, index) => (
              <div key={label} className="write-in grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4" style={line(index + 1)}>
                <dt className="mirror__label col-span-2" lang="fr">{label}</dt>
                <dd className={`mirror__script ${plat ? 'text-[clamp(2.1rem,3.8vw,2.9rem)]' : 'text-[clamp(1.75rem,3vw,2.25rem)]'}`} lang="fr">
                  <DishName dish={dish} />
                </dd>
                <dd className={`mirror__script ${plat ? 'text-[clamp(1.9rem,3.4vw,2.5rem)]' : 'text-[clamp(1.55rem,2.6vw,1.95rem)]'}`}>{formatPrice(dish.price)}</dd>
                <dd className="col-span-2 max-w-[36rem] text-[.92rem] leading-snug italic opacity-90">{dish.description}</dd>
              </div>
            ))}
          </dl>

          <Flourish className="write-in mx-auto my-[clamp(.6rem,1.8vw,1.1rem)] h-auto w-[min(70%,240px)] opacity-80" />

          <ul className="write-in grid gap-0.5" style={line(4)}>
            {menu.formules.map(formule => (
              <li key={formule.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="mirror__script text-[clamp(1.5rem,2.6vw,1.9rem)]" lang="fr">{formule.name}</span>
                <span className="mirror__script text-[clamp(1.45rem,2.5vw,1.8rem)]">
                  {formule.options.map(option => formatPrice(option.price)).filter((price, i, all) => all.indexOf(price) === i).join(' · ')}
                </span>
              </li>
            ))}
          </ul>

          {mirror.note ? (
            <p className="write-in mirror__script mt-2 text-center text-[clamp(1.5rem,2.6vw,1.9rem)]" style={line(5)}>{mirror.note}</p>
          ) : null}

          <p className="write-in mt-[clamp(.75rem,2vw,1.1rem)] flex justify-center text-center text-[.8rem] font-semibold tracking-[.14em] uppercase" style={line(6)}>
            <ServiceStatus />
          </p>
        </div>
      </div>
      <Banquette />
    </figure>
  );
}

/** A compact strip of today's mirror for the top of the carte page. */
export function MirrorStrip() {
  return (
    <section className="mirror rounded-[8px]" aria-labelledby="mirror-strip-title">
      <div className="mirror__glass mirror__text grid items-center gap-x-8 gap-y-4 px-[clamp(1.1rem,3vw,2rem)] py-5 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <MirrorReflection />
        <h2 id="mirror-strip-title" className="write-in text-center font-normal lg:text-left" lang="fr" style={line(0)}>
          <MirrorHeading date={mirror.date} className="block text-[clamp(2.3rem,4vw,2.9rem)]" />
        </h2>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
          {dishes().map(({ label, dish }, index) => (
            <div key={label} className="write-in" style={line(index + 1)}>
              <dt className="mirror__label" lang="fr">{label}</dt>
              <dd className="mirror__script text-[1.75rem]" lang="fr"><DishName dish={dish} /></dd>
              <dd className="tabular text-[.95rem] font-semibold">{formatPrice(dish.price)}</dd>
            </div>
          ))}
        </dl>
        <p className="write-in flex justify-center text-[.78rem] font-semibold tracking-[.12em] uppercase lg:max-w-[14rem] lg:justify-end lg:text-right" style={line(4)}>
          <ServiceStatus />
        </p>
      </div>
    </section>
  );
}
