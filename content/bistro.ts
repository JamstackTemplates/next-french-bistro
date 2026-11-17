// Bistro details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious bistro: the chef, the market and the story are
// invented. The sample address is a public landmark (Lafayette Park in St. Louis) so the map has
// something real to show; replace it with yours.
// Plain strings only: text is rendered as text, never as HTML.

import type { DayHours, Service } from '../lib/services';

export type { Day, DayHours, Service, ServiceLabel } from '../lib/services';

export interface Amenity {
  /** Short French name, e.g. "La terrasse". */
  title: string;
  /** One plain-English sentence. */
  detail: string;
}

export interface StoryPoint {
  /** e.g. "Le marché" */
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface BistroLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Bistro {
  name: string;
  /** Short line under the name, e.g. "Bistro · zinc · terrasse". */
  tagline: string;
  /** One or two sentences: the first thing visitors read beside the mirror. */
  introduction: string;
  /** Home page "the bistro" paragraphs. */
  story: string[];
  /** Exactly three short points shown with the story. */
  storyPoints: StoryPoint[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(314) 555-0182". Set to '' to hide it. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Landmark or cross streets shown under the address. */
    note?: string;
    /** Short cross streets for the enamel street plaque over "Find us", e.g. "Lafayette & Mississippi". */
    crossStreets?: string;
  };
  /** How to find you: transit, parking, step-free access. */
  directions: string[];
  /**
   * Every day of the week, Monday first, with its services in local time (the time zone is `timeZone`
   * in site.config.json). `services: []` means closed all day.
   */
  hours: DayHours[];
  /** Optional one-off notice such as holiday closures. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: BistroLink[];
}

const dejeuner: Service = { label: 'Déjeuner', opens: '11:30', closes: '14:30' };
const diner: Service = { label: 'Dîner', opens: '17:30', closes: '22:00' };

export const bistro: Bistro = {
  name: 'Bistro du Lampadaire',
  tagline: 'Bistro · zinc · terrasse',
  introduction:
    'A corner bistro under the street lamp: the plat du jour on the mirror, a carafe on the zinc, and a long dinner when the lamps come on.',
  story: [
    'Our chef came home from ten years in the bouchons of Lyon with a notebook of recipes and a rule: cook what the market has, and write it on the mirror.',
    'The rest is simple. Paper on the tables, bread from down the street, wine poured by the glass, the pot or the bottle, and nobody hurrying you out.',
  ],
  storyPoints: [
    { title: 'Le marché', detail: 'We shop every morning, and the mirror changes with what came in.' },
    { title: 'Le zinc', detail: 'Eat at the bar on your own, with a glass and the plat du jour.' },
    { title: 'La terrasse', detail: 'Eight tables under the awning from May to October, first come.' },
  ],
  email: 'hello@example.com',
  phone: '(314) 555-0182',
  address: {
    street: 'Lafayette Park, 2023 Lafayette Ave',
    locality: 'St. Louis',
    region: 'MO',
    postalCode: '63104',
    country: 'US',
    note: 'On the south side of Lafayette Park, near Lafayette and Mississippi Avenues',
    crossStreets: 'Lafayette & Mississippi',
  },
  directions: [
    'MetroBus 30 stops on Lafayette Avenue, a short walk from the park’s south gate.',
    'Street parking around the park; it fills up on summer evenings, so allow a few minutes.',
    'Step-free entrance from the terrace and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday', services: [] },
    { day: 'Tuesday', services: [dejeuner, diner] },
    { day: 'Wednesday', services: [dejeuner, diner] },
    { day: 'Thursday', services: [dejeuner, diner] },
    { day: 'Friday', services: [dejeuner, diner] },
    { day: 'Saturday', services: [diner] },
    { day: 'Sunday', services: [] },
  ],
  notice: '',
  amenities: [
    { title: 'La terrasse', detail: 'Eight tables outside in summer, first come, first served.' },
    { title: 'Le zinc', detail: 'Seats at the bar for one or two, no waiting list.' },
    { title: 'Le salon', detail: 'A private room for up to 18 guests. Ask through Contact.' },
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'Small tables and the terrace are walk-in, first come, first served. For six or more, or the private room, send us an enquiry through Contact and we’ll reply to confirm.',
    },
    {
      question: 'What’s in the formule?',
      answer: 'At lunch, two or three courses from the dishes marked “formule” on the carte, with bread and a glass of house wine (21+ with ID) or a citron pressé. At dinner, the menu du soir is a prix-fixe of two or three courses.',
    },
    {
      question: 'Do you have vegetarian and vegan dishes?',
      answer: 'Yes. Every section of the carte has vegetarian dishes, and there’s always at least one vegan entrée and plat. The carte marks them, and the filter on the carte page shows only those.',
    },
    {
      question: 'Can you cook gluten-free?',
      answer: 'Dishes marked GF are made with gluten-free ingredients, but we share one small kitchen with flour and bread, so we can’t promise no cross-contact. Tell us about allergies when you order.',
    },
    {
      question: 'Are children welcome?',
      answer: 'Of course. We’re happy to serve a half portion of most plats, and there’s always steak frites or a simple omelette.',
    },
    {
      question: 'Can I bring my own wine?',
      answer: 'Yes, there’s a corkage fee of $20 a bottle, waived if you also order a bottle from our list.',
    },
    {
      question: 'Is the terrace open in winter?',
      answer: 'The terrace closes from November to April. In winter the best seats are at the zinc or by the mirror.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = bistro.links.filter(link => link.url.trim() !== '');

/** Single-line postal address. */
export function formatAddress(address = bistro.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** "tel:" href for a phone number written for people. */
export function telHref(phone = bistro.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
