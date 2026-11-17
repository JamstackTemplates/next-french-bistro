// The carte, the formules and the day's mirror. Every page reads from this file.
// Dish names are French with plain-English descriptions; prices are placeholders, replace them with yours.
// Plain strings only: text is rendered as text, never as HTML.

/* ==================================================================================================
   THE MIRROR: today's menu, hand-lettered on the big mirror at the top of the home page.
   This is the edit you'll make most often. Change the dishes, then set `date` to today (YYYY-MM-DD).
   The mirror says "Aujourd'hui" only on that date in your time zone; on any other day it says
   "Au menu" with the date written small, so it never claims yesterday's dishes are today's.
   Each dish is either a carte dish by id, e.g. { id: 'tarte-tatin' }, or written out in full.
   ================================================================================================== */
export const mirror: Mirror = {
  date: '2026-11-17',
  platDuJour: {
    name: 'Blanquette de veau',
    description: 'Veal simmered in a creamy white sauce with button mushrooms and baby onions, with rice.',
    price: 29,
  },
  entreeDuJour: { id: 'poireaux-vinaigrette' },
  dessertDuJour: { id: 'tarte-tatin' },
  note: 'Bouillabaisse on Fridays',
};

/** A carte dish by id, or a dish written out for the day. */
export type MirrorDish =
  | { /** Id of a dish on the carte below. It must not be sold out. */ id: string }
  | {
    /** French name, properly accented, e.g. "Blanquette de veau". */
    name: string;
    /** Plain-English description. */
    description: string;
    /** Price in `menu.currency`, e.g. 29 for $29. */
    price: number;
  };

export interface Mirror {
  /** The day this mirror was written for, as YYYY-MM-DD. Optional: without it the mirror reads "Au menu". */
  date?: string;
  platDuJour: MirrorDish;
  entreeDuJour: MirrorDish;
  dessertDuJour: MirrorDish;
  /** Optional short line at the foot of the mirror, e.g. "Bouillabaisse on Fridays". */
  note?: string;
}

/** Dietary marks shown on the carte and used by its filters. */
export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts' | 'contains-shellfish';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free': { label: 'Gluten-free ingredients (shared kitchen)', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
  'contains-shellfish': { label: 'Contains shellfish', short: 'SF' },
};

export type Badge = 'maison' | 'saison' | 'new';

export const BADGES: Record<Badge, { label: string; title: string }> = {
  maison: { label: 'Maison', title: 'Made in house' },
  saison: { label: 'De saison', title: 'In season' },
  new: { label: 'Nouveau', title: 'New on the carte' },
};

/** Fine line drawing shown with a featured dish. See components/dish-art.tsx. */
export type DishArt = 'cocotte' | 'steak-frites' | 'ramekin' | 'cheese-board' | 'bowl' | 'tart';

export const DISH_ARTS: readonly DishArt[] = ['cocotte', 'steak-frites', 'ramekin', 'cheese-board', 'bowl', 'tart'];

export interface Dish {
  /** Unique, URL-safe id used for links such as /menu/#steak-frites. */
  id: string;
  /** French name, properly accented, e.g. "Œuf mayonnaise". */
  name: string;
  /** Plain-English description. */
  description: string;
  /** Price in `menu.currency`, e.g. 14.5 for $14.50. */
  price: number;
  diet?: Diet[];
  /** Optional mark: made in house, in season, or new. */
  badge?: Badge;
  /** Can be chosen as part of a formule (marked on the carte). */
  formule?: boolean;
  /** Show under "Suggestions du chef" on the home page (needs `art`). */
  featured?: boolean;
  /** Drawing for featured dishes. */
  art?: DishArt;
  /** Set to true to strike the dish through as "plus disponible / sold out" without deleting it. */
  soldOut?: boolean;
}

export type Course = 'entrée' | 'plat' | 'fromage' | 'dessert';

export const COURSES: readonly Course[] = ['entrée', 'plat', 'fromage', 'dessert'];

export interface CarteSection {
  /** Unique, URL-safe id used for links such as /menu/#plats. */
  id: string;
  /** French title shown on the enamel plaque, e.g. "Les entrées". */
  title: string;
  /** English subtitle, e.g. "Starters". */
  subtitle: string;
  /** One line under the plaque. */
  description: string;
  /** The course this section counts as in a formule. Omit for sections outside the formules. */
  course?: Course;
  /** Show as a short, compact list (e.g. coffee and digestifs) instead of full carte entries. */
  compact?: boolean;
  dishes: Dish[];
}

export interface FormuleOption {
  /** Courses in order, e.g. ['entrée', 'plat']. */
  courses: Course[];
  price: number;
}

export interface Formule {
  /** Unique, URL-safe id. */
  id: string;
  /** e.g. "Formule déjeuner" or "Menu du soir". */
  name: string;
  /** The service it's served at: lunch (déjeuner) or dinner (dîner). */
  service: 'déjeuner' | 'dîner';
  /** When, in plain English, e.g. "Tuesday to Friday, lunch". */
  when: string;
  /** Allowed course combinations and their prices. More courses must cost more. */
  options: FormuleOption[];
  /** Small print, e.g. "Served with bread and a glass of house wine". */
  note: string;
}

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  formules: Formule[];
  sections: CarteSection[];
  /** Small print under the carte, e.g. allergy advice. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  formules: [
    {
      id: 'formule-dejeuner',
      name: 'Formule déjeuner',
      service: 'déjeuner',
      when: 'Tuesday to Friday, at lunch',
      options: [
        { courses: ['entrée', 'plat'], price: 26 },
        { courses: ['plat', 'dessert'], price: 26 },
        { courses: ['entrée', 'plat', 'dessert'], price: 32 },
      ],
      note: 'Served with bread and a glass of house wine (21+ with ID) or a citron pressé.',
    },
    {
      id: 'menu-du-soir',
      name: 'Menu du soir',
      service: 'dîner',
      when: 'Tuesday to Saturday, at dinner',
      options: [
        { courses: ['entrée', 'plat'], price: 44 },
        { courses: ['plat', 'dessert'], price: 44 },
        { courses: ['entrée', 'plat', 'dessert'], price: 54 },
      ],
      note: 'Choose from any dish marked formule. Add the cheese board for $9.',
    },
  ],
  sections: [
    {
      id: 'entrees',
      title: 'Les entrées',
      subtitle: 'Starters',
      description: 'To share, or to start. Bread and butter come to every table.',
      course: 'entrée',
      dishes: [
        {
          id: 'soupe-a-l-oignon',
          name: 'Soupe à l’oignon gratinée',
          description: 'Slow-cooked onion soup with beef broth, under a crust of toasted bread and melted Comté.',
          price: 13,
          badge: 'maison',
          formule: true,
          featured: true,
          art: 'bowl',
        },
        {
          id: 'oeuf-mayonnaise',
          name: 'Œuf mayonnaise',
          description: 'Soft-boiled eggs with house mayonnaise, chives and a little crisp lettuce.',
          price: 9,
          diet: ['vegetarian', 'gluten-free'],
          formule: true,
        },
        {
          id: 'salade-lyonnaise',
          name: 'Salade lyonnaise',
          description: 'Frisée with smoked bacon lardons, croutons, a poached egg and a warm mustard dressing.',
          price: 14,
          formule: true,
        },
        {
          id: 'escargots-de-bourgogne',
          name: 'Escargots de Bourgogne',
          description: 'Six snails baked in garlic and parsley butter, with bread to mop it up.',
          price: 16,
        },
        {
          id: 'pate-en-croute',
          name: 'Pâté en croûte',
          description: 'Pork and duck pâté baked in pastry, with cornichons and a spoon of mustard.',
          price: 15,
          badge: 'maison',
          diet: ['contains-nuts'],
        },
        {
          id: 'poireaux-vinaigrette',
          name: 'Poireaux vinaigrette',
          description: 'Gently cooked young leeks with a sharp mustard vinaigrette and toasted hazelnuts.',
          price: 11,
          badge: 'saison',
          diet: ['vegan', 'gluten-free', 'contains-nuts'],
          formule: true,
        },
      ],
    },
    {
      id: 'plats',
      title: 'Les plats',
      subtitle: 'Mains',
      description: 'The heart of the carte. Ask for a half portion for children.',
      course: 'plat',
      dishes: [
        {
          id: 'steak-frites',
          name: 'Steak frites',
          description: 'Grilled hanger steak with shallot butter, hand-cut fries and a green salad.',
          price: 34,
          diet: ['gluten-free'],
          featured: true,
          art: 'steak-frites',
        },
        {
          id: 'boeuf-bourguignon',
          name: 'Bœuf bourguignon',
          description: 'Beef braised for hours in red wine with carrots, mushrooms and lardons, with buttered potatoes.',
          price: 31,
          badge: 'maison',
          formule: true,
          featured: true,
          art: 'cocotte',
        },
        {
          id: 'confit-de-canard',
          name: 'Confit de canard',
          description: 'Crisp-skinned duck leg, slow-cooked in its own fat, with garlic potatoes and frisée.',
          price: 32,
          diet: ['gluten-free'],
        },
        {
          id: 'moules-mariniere',
          name: 'Moules marinière',
          description: 'A pot of mussels steamed with white wine, shallots and parsley, with fries.',
          price: 27,
          diet: ['contains-shellfish'],
          formule: true,
        },
        {
          id: 'sole-meuniere',
          name: 'Sole meunière',
          description: 'Whole sole cooked in brown butter with lemon and capers, with steamed potatoes.',
          price: 42,
          soldOut: true,
        },
        {
          id: 'tian-de-legumes',
          name: 'Tian de légumes',
          description: 'A baked ratatouille tian of courgette, aubergine and tomato with herbs, goat’s cheese and a crisp salad.',
          price: 24,
          diet: ['vegetarian', 'gluten-free'],
          formule: true,
        },
        {
          id: 'lentilles-du-puy',
          name: 'Lentilles du Puy aux légumes d’hiver',
          description: 'Green lentils cooked with roast squash, carrots and thyme, finished with a walnut-oil dressing.',
          price: 23,
          badge: 'new',
          diet: ['vegan', 'gluten-free'],
          formule: true,
        },
      ],
    },
    {
      id: 'fromages',
      title: 'Les fromages',
      subtitle: 'Cheese',
      description: 'From a cheesemonger nearby, served with bread and a little fruit paste.',
      course: 'fromage',
      dishes: [
        {
          id: 'plateau-de-fromages',
          name: 'Plateau de fromages',
          description: 'All three cheeses below, with walnuts, fruit paste and bread.',
          price: 18,
          diet: ['vegetarian', 'contains-nuts'],
          featured: true,
          art: 'cheese-board',
        },
        {
          id: 'comte',
          name: 'Comté',
          description: 'A firm, nutty cow’s-milk cheese from the Jura mountains, aged about eighteen months.',
          price: 8,
          diet: ['vegetarian', 'gluten-free'],
        },
        {
          id: 'crottin-de-chevre',
          name: 'Crottin de chèvre',
          description: 'A small, tangy goat’s-milk cheese in the style of the Loire Valley.',
          price: 8,
          diet: ['gluten-free'],
        },
        {
          id: 'bleu-d-auvergne',
          name: 'Bleu d’Auvergne',
          description: 'A creamy, gently sharp blue cheese from the Auvergne.',
          price: 8,
          diet: ['gluten-free'],
        },
      ],
    },
    {
      id: 'desserts',
      title: 'Les desserts',
      subtitle: 'Desserts',
      description: 'Made here every morning. Ask what’s left by the end of service.',
      course: 'dessert',
      dishes: [
        {
          id: 'creme-brulee',
          name: 'Crème brûlée',
          description: 'Vanilla custard under a crackling burnt-sugar top.',
          price: 11,
          diet: ['vegetarian', 'gluten-free'],
          formule: true,
          featured: true,
          art: 'ramekin',
        },
        {
          id: 'tarte-tatin',
          name: 'Tarte Tatin',
          description: 'Upside-down caramelised apple tart, served warm with crème fraîche.',
          price: 12,
          badge: 'maison',
          diet: ['vegetarian'],
          formule: true,
          featured: true,
          art: 'tart',
        },
        {
          id: 'ile-flottante',
          name: 'Île flottante',
          description: 'Poached meringue floating on vanilla custard, with caramel and pink praline.',
          price: 10,
          diet: ['vegetarian', 'gluten-free', 'contains-nuts'],
          formule: true,
        },
        {
          id: 'mousse-au-chocolat',
          name: 'Mousse au chocolat',
          description: 'Dark chocolate mousse served from the bowl at the table.',
          price: 10,
          diet: ['vegetarian', 'gluten-free'],
          formule: true,
        },
        {
          id: 'profiteroles',
          name: 'Profiteroles',
          description: 'Choux buns filled with vanilla ice cream under warm chocolate sauce and toasted almonds.',
          price: 12,
          diet: ['vegetarian', 'contains-nuts'],
        },
      ],
    },
    {
      id: 'cafe-digestifs',
      title: 'Café & digestifs',
      subtitle: 'Coffee and after-dinner',
      description: 'To finish. Digestifs are 21+ with ID.',
      compact: true,
      dishes: [
        { id: 'cafe-express', name: 'Café express', description: 'A short espresso.', price: 3.5, diet: ['vegan', 'gluten-free'] },
        { id: 'cafe-creme', name: 'Café crème', description: 'Espresso with steamed milk.', price: 4.5, diet: ['vegetarian', 'gluten-free'] },
        { id: 'infusion', name: 'Infusion', description: 'Verbena, chamomile or mint.', price: 4, diet: ['vegan', 'gluten-free'] },
        { id: 'calvados', name: 'Calvados', description: 'Apple brandy from Normandy, 4cl.', price: 12 },
        { id: 'armagnac', name: 'Armagnac', description: 'Grape brandy from Gascony, 4cl.', price: 14 },
      ],
    },
  ],
  notes: [
    'GF means made with gluten-free ingredients. We cook in one small shared kitchen with flour, nuts and shellfish, so we can’t promise no cross-contact. Please tell us about allergies when you order.',
    'Dishes marked formule can be chosen for the formule déjeuner or the menu du soir.',
    'Alcohol is served to guests 21 and over; please bring ID.',
  ],
};

/** Every dish on the carte, in order. */
export const allDishes: Dish[] = menu.sections.flatMap(section => section.dishes);

/** Dishes for "Suggestions du chef" on the home page. */
export const featuredDishes: Dish[] = allDishes.filter(dish => dish.featured);

export function findDish(id: string): Dish | undefined {
  return allDishes.find(dish => dish.id === id);
}

export interface ResolvedMirrorDish {
  name: string;
  description: string;
  price: number;
  /** Set when the dish is on the carte, for a link to /menu/#id. */
  id?: string;
}

/** Looks up a carte dish by id, or returns the written-out dish. Undefined for an unknown id. */
export function resolveMirrorDish(dish: MirrorDish): ResolvedMirrorDish | undefined {
  if ('id' in dish) {
    const found = findDish(dish.id);
    return found ? { name: found.name, description: found.description, price: found.price, id: found.id } : undefined;
  }
  return dish;
}

const formatters = new Map<string, Intl.NumberFormat>();

/** 4.5 → "$4.50", 12 → "$12". */
export function formatPrice(amount: number, { currency = menu.currency, locale = menu.locale } = {}): string {
  const whole = Number.isInteger(amount);
  const key = `${locale}|${currency}|${whole}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency', currency, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(amount);
}

/** ['entrée', 'plat'] → "Entrée + plat". */
export function formatCourses(courses: readonly Course[]): string {
  const text = courses.join(' + ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
