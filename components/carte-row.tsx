import { BADGES, DIETS, formatPrice, type Dish } from '../content/menu';

/** A hand-drawn line through a sold-out dish. */
function StrikeLine() {
  return (
    <svg className="strike-line" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M1 6.5C18 3 30 7 48 4.8S80 3.5 99 5.5" />
    </svg>
  );
}

/** Diet marks, e.g. V, VG, GF, with their full meaning in a title and for screen readers. */
export function DietMarks({ dish }: { dish: Dish }) {
  if (!dish.diet?.length) return null;
  return (
    <span className="inline-flex flex-none gap-1">
      {dish.diet.map(diet => (
        <abbr key={diet} title={DIETS[diet].label} className={`mark mark-${diet}`}>
          <span aria-hidden="true">{DIETS[diet].short}</span><span className="sr-only">{DIETS[diet].label}</span>
        </abbr>
      ))}
    </span>
  );
}

/**
 * One line of the printed carte: the French name in small caps, diet marks, a dotted leader and a
 * right-aligned price; the English description in italic below. Sold-out dishes are struck through.
 */
export function CarteRow({ dish }: { dish: Dish }) {
  const soldOut = Boolean(dish.soldOut);
  return (
    <li id={dish.id} data-sold-out={soldOut} className="carte-row break-inside-avoid border-b border-dotted border-line py-3.5">
      <div className="flex items-baseline gap-2">
        <h3 className="dish-name font-sans text-[1.12rem] leading-snug" lang="fr">
          {soldOut ? <span className="struck">{dish.name}<StrikeLine /></span> : dish.name}
        </h3>
        <DietMarks dish={dish} />
        <span className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-rule" aria-hidden="true" />
        <span className="carte-price tabular font-semibold">{formatPrice(dish.price)}</span>
      </div>
      <p className="carte-desc mt-0.5 text-[.96rem] leading-normal text-muted italic">{dish.description}</p>
      {soldOut || dish.badge || dish.formule ? (
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[.74rem] font-semibold tracking-[.14em] uppercase">
          {soldOut ? <span className="text-accent"><span className="font-script text-[1.3rem] tracking-normal normal-case" lang="fr">plus disponible</span> · sold out</span> : null}
          {dish.badge ? <span className="text-brass-ink" title={BADGES[dish.badge].title} lang="fr">{BADGES[dish.badge].label}</span> : null}
          {dish.formule ? <span className="text-accent" title="Can be chosen for a formule" lang="fr">✦ Formule</span> : null}
        </p>
      ) : null}
    </li>
  );
}
