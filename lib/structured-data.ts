import { bistro } from '../content/bistro';
import { menu } from '../content/menu';
import { absoluteUrl } from './paths';

const SCHEMA_DAYS = {
  Monday: 'https://schema.org/Monday', Tuesday: 'https://schema.org/Tuesday', Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday', Friday: 'https://schema.org/Friday', Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
} as const;

/** schema.org Restaurant for search engines and maps. Built from the same content as the pages. */
export function bistroStructuredData() {
  const url = absoluteUrl('/');
  const menuUrl = absoluteUrl('/menu/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: bistro.name,
    description: bistro.introduction,
    ...(url ? { url } : {}),
    ...(menuUrl ? { hasMenu: menuUrl } : {}),
    email: bistro.email,
    ...(bistro.phone ? { telephone: bistro.phone } : {}),
    servesCuisine: ['French', 'Bistro'],
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    // Small tables walk in; groups and the private room go through a Contact enquiry.
    acceptsReservations: false,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bistro.address.street,
      addressLocality: bistro.address.locality,
      addressRegion: bistro.address.region,
      postalCode: bistro.address.postalCode,
      addressCountry: bistro.address.country,
    },
    openingHoursSpecification: bistro.hours.flatMap(entry => entry.services.map(service => ({
      '@type': 'OpeningHoursSpecification',
      name: service.label,
      dayOfWeek: SCHEMA_DAYS[entry.day],
      opens: service.opens,
      closes: service.closes,
    }))),
    sameAs: bistro.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
