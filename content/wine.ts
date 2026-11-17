// La cave: the wine list and how it's poured. The wine page and the home page read from this file.
// Producer names are invented or generic ("Rouge de la maison"); the appellations are real places.
// Replace them with your own list. Plain strings only: text is rendered as text, never as HTML.
// Alcohol is served to guests 21 and over with ID.

/** Drawing for a measure. See components/wine-vessels.tsx. */
export type VesselIcon = 'verre' | 'pot' | 'carafe' | 'bouteille';

export const VESSEL_ICONS: readonly VesselIcon[] = ['verre', 'pot', 'carafe', 'bouteille'];

export interface Measure {
  /** Unique, URL-safe id used as the key in each wine's `prices`, e.g. "verre". */
  id: string;
  /** Name shown above the prices, e.g. "Pot lyonnais". */
  label: string;
  /** Volume as written for people, e.g. "46cl". */
  volume: string;
  /** Which drawing to use. */
  icon: VesselIcon;
}

export type WineStyle = 'rouge' | 'blanc' | 'rosé' | 'bulles' | 'doux';

/** Styles in the order they're listed, with the plaque title and an English subtitle. */
export const STYLES: Record<WineStyle, { title: string; subtitle: string }> = {
  rouge: { title: 'Les rouges', subtitle: 'Red' },
  blanc: { title: 'Les blancs', subtitle: 'White' },
  'rosé': { title: 'Les rosés', subtitle: 'Rosé' },
  bulles: { title: 'Les bulles', subtitle: 'Sparkling' },
  doux: { title: 'Les doux', subtitle: 'Sweet' },
};

export interface Wine {
  /** Unique, URL-safe id used for links such as /wine/#rouge-de-la-maison. */
  id: string;
  /** Invented or generic name, never a real château, domaine or brand. */
  name: string;
  /** Real appellation, e.g. "Côtes du Rhône". */
  appellation: string;
  /** Wine region, e.g. "Rhône". */
  region: string;
  style: WineStyle;
  /** Grape varieties, e.g. ["Grenache", "Syrah"]. */
  grapes: string[];
  /** One short, plain-English tasting note. */
  notes: string;
  /** Price per measure id. Only list the measures you pour this wine in. */
  prices: Record<string, number>;
  /** Show under "La cave" on the home page. */
  featured?: boolean;
  /** Set to true to strike it through as sold out without deleting it. */
  soldOut?: boolean;
}

export interface SoftDrink {
  /** Unique, URL-safe id. */
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Cave {
  /** How you pour, left to right. Rename or remove a measure here; prices follow by id. */
  measures: Measure[];
  /** House wines first, then by style. */
  wines: Wine[];
  /** Sans alcool: non-alcoholic drinks. */
  sansAlcool: SoftDrink[];
  /** "How we pour" paragraphs on the wine page. */
  howWePour: string[];
}

export const cave: Cave = {
  measures: [
    { id: 'verre', label: 'Verre', volume: '12cl', icon: 'verre' },
    { id: 'pot', label: 'Pot lyonnais', volume: '46cl', icon: 'pot' },
    { id: 'carafe', label: 'Carafe', volume: '50cl', icon: 'carafe' },
    { id: 'bouteille', label: 'Bouteille', volume: '75cl', icon: 'bouteille' },
  ],
  wines: [
    {
      id: 'rouge-de-la-maison',
      name: 'Rouge de la maison',
      appellation: 'Côtes du Rhône',
      region: 'Rhône',
      style: 'rouge',
      grapes: ['Grenache', 'Syrah'],
      notes: 'Round and warm, with dark cherry and a little pepper. Made for the plat du jour.',
      prices: { verre: 9, pot: 28, bouteille: 42 },
      featured: true,
    },
    {
      id: 'blanc-de-la-maison',
      name: 'Blanc de la maison',
      appellation: 'Mâcon-Villages',
      region: 'Burgundy',
      style: 'blanc',
      grapes: ['Chardonnay'],
      notes: 'Fresh and lightly creamy, with apple and a mineral finish.',
      prices: { verre: 9, pot: 28, bouteille: 42 },
      featured: true,
    },
    {
      id: 'rose-de-la-maison',
      name: 'Rosé de la maison',
      appellation: 'Côtes de Provence',
      region: 'Provence',
      style: 'rosé',
      grapes: ['Grenache', 'Cinsault'],
      notes: 'Pale, dry and bright, with redcurrant and a salty edge. The terrace wine.',
      prices: { verre: 9, pot: 28, bouteille: 42 },
    },
    {
      id: 'cuvee-du-zinc',
      name: 'Cuvée du Zinc',
      appellation: 'Beaujolais-Villages',
      region: 'Beaujolais',
      style: 'rouge',
      grapes: ['Gamay'],
      notes: 'Juicy, light and served a little cool, as they do in Lyon.',
      prices: { verre: 11, pot: 32, bouteille: 48 },
      featured: true,
    },
    {
      id: 'rouge-des-coteaux',
      name: 'Rouge des Coteaux',
      appellation: 'Morgon',
      region: 'Beaujolais',
      style: 'rouge',
      grapes: ['Gamay'],
      notes: 'Deeper than its neighbours, with violet and plum. Lovely with the bourguignon.',
      prices: { verre: 13, bouteille: 56 },
    },
    {
      id: 'cuvee-des-platanes',
      name: 'Cuvée des Platanes',
      appellation: 'Chinon',
      region: 'Loire',
      style: 'rouge',
      grapes: ['Cabernet Franc'],
      notes: 'Raspberry, a hint of graphite and fine tannins. Good slightly chilled.',
      prices: { verre: 12, carafe: 36, bouteille: 52 },
    },
    {
      id: 'vieilles-vignes-du-lot',
      name: 'Vieilles Vignes du Lot',
      appellation: 'Cahors',
      region: 'South West',
      style: 'rouge',
      grapes: ['Malbec'],
      notes: 'Dark, firm and generous: blackberry and liquorice. For steak and confit.',
      prices: { bouteille: 54 },
    },
    {
      id: 'rouge-de-l-estuaire',
      name: 'Rouge de l’Estuaire',
      appellation: 'Bordeaux Supérieur',
      region: 'Bordeaux',
      style: 'rouge',
      grapes: ['Merlot', 'Cabernet Sauvignon'],
      notes: 'Classic and supple, with plum, cedar and a long, dry finish.',
      prices: { carafe: 34, bouteille: 50 },
    },
    {
      id: 'blanc-de-l-atlantique',
      name: 'Blanc de l’Atlantique',
      appellation: 'Muscadet Sèvre et Maine',
      region: 'Loire',
      style: 'blanc',
      grapes: ['Melon de Bourgogne'],
      notes: 'Bone-dry, salty and lemony. Exactly what the moules want.',
      prices: { verre: 10, carafe: 30, bouteille: 44 },
    },
    {
      id: 'cuvee-des-silex',
      name: 'Cuvée des Silex',
      appellation: 'Sancerre',
      region: 'Loire',
      style: 'blanc',
      grapes: ['Sauvignon Blanc'],
      notes: 'Crisp and aromatic, with grapefruit, cut grass and flint.',
      prices: { verre: 15, bouteille: 64 },
    },
    {
      id: 'blanc-des-collines',
      name: 'Blanc des Collines',
      appellation: 'Alsace',
      region: 'Alsace',
      style: 'blanc',
      grapes: ['Riesling'],
      notes: 'Dry and taut, with lime, white flowers and a long finish.',
      prices: { verre: 12, bouteille: 52 },
      soldOut: true,
    },
    {
      id: 'rose-de-tavel',
      name: 'Rosé de Tavel',
      appellation: 'Tavel',
      region: 'Rhône',
      style: 'rosé',
      grapes: ['Grenache', 'Cinsault', 'Syrah'],
      notes: 'A deeper, food-friendly rosé with strawberry and spice.',
      prices: { bouteille: 48 },
    },
    {
      id: 'cremant-de-la-maison',
      name: 'Crémant de la maison',
      appellation: 'Crémant d’Alsace',
      region: 'Alsace',
      style: 'bulles',
      grapes: ['Pinot Blanc', 'Auxerrois'],
      notes: 'Fine bubbles, green apple and brioche. For celebrations, or a Tuesday.',
      prices: { verre: 12, bouteille: 54 },
    },
    {
      id: 'doux-du-ventoux',
      name: 'Doux du Ventoux',
      appellation: 'Muscat de Beaumes-de-Venise',
      region: 'Rhône',
      style: 'doux',
      grapes: ['Muscat'],
      notes: 'Sweet, floral and orange-scented. With the tarte Tatin or the bleu.',
      prices: { verre: 10, bouteille: 46 },
    },
  ],
  sansAlcool: [
    { id: 'citron-presse', name: 'Citron pressé', description: 'Fresh-squeezed lemon with a jug of water and sugar to taste.', price: 5 },
    { id: 'sirop-a-l-eau', name: 'Sirop à l’eau', description: 'Mint, grenadine or violet syrup with still or sparkling water.', price: 4 },
    { id: 'petillant-sans-alcool', name: 'Pétillant sans alcool', description: 'A dry, non-alcoholic sparkling wine, by the glass.', price: 8 },
    { id: 'biere-sans-alcool', name: 'Bière sans alcool', description: 'An alcohol-free blonde beer, bottle.', price: 6 },
    { id: 'jus-de-pomme', name: 'Jus de pomme', description: 'Cloudy pressed apple juice from an orchard nearby.', price: 5 },
  ],
  howWePour: [
    'Like a Lyon bouchon, we pour by the measure. A verre is a 12cl glass. The pot lyonnais is a heavy-bottomed 46cl bottle, the traditional bistro measure: enough for two people to have a couple of glasses each, at a better price than glasses one by one.',
    'Some wines come in a 50cl carafe instead, and every wine is available by the bottle. Prices are listed only under the measures we pour that wine in. We serve alcohol to guests 21 and over, so please bring ID, and we’re always happy to pour a smaller glass.',
  ],
};

/** Wines grouped by style, in STYLES order, skipping empty styles. */
export function winesByStyle(wines = cave.wines): { style: WineStyle; wines: Wine[] }[] {
  return (Object.keys(STYLES) as WineStyle[])
    .map(style => ({ style, wines: wines.filter(wine => wine.style === style) }))
    .filter(group => group.wines.length > 0);
}

export const featuredWines: Wine[] = cave.wines.filter(wine => wine.featured);

/** Measures actually used by a set of wines, in measure order. Keeps short lists free of empty columns. */
export function usedMeasures(wines: readonly Wine[], measures = cave.measures): Measure[] {
  return measures.filter(measure => wines.some(wine => measure.id in wine.prices));
}
