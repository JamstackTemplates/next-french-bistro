import type { Diet, Dish } from '../content/menu';

/** Filters offered on the carte page. Each one narrows the carte; several together must all match. */
export type CarteFilter = 'vegetarian' | 'vegan' | 'no-shellfish';

export const CARTE_FILTERS: { id: CarteFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'no-shellfish', label: 'No shellfish' },
];

function has(dish: Pick<Dish, 'diet'>, diet: Diet): boolean {
  return dish.diet?.includes(diet) ?? false;
}

/** Vegan dishes count as vegetarian even when not tagged twice. */
export function matchesFilter(dish: Pick<Dish, 'diet'>, filter: CarteFilter): boolean {
  switch (filter) {
    case 'vegetarian': return has(dish, 'vegetarian') || has(dish, 'vegan');
    case 'vegan': return has(dish, 'vegan');
    case 'no-shellfish': return !has(dish, 'contains-shellfish');
  }
}

export function matchesAll(dish: Pick<Dish, 'diet'>, filters: readonly CarteFilter[]): boolean {
  return filters.every(filter => matchesFilter(dish, filter));
}
