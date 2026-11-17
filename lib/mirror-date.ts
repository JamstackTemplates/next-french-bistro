// The mirror's honest date. The owner writes a date on the mirror menu when they update it; the browser
// compares it with today in the bistro's time zone. Only a match may say "Aujourd'hui" (today), so the
// site never claims yesterday's dishes are today's. Pure functions, unit tested.

export const ISO_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** True for a real calendar date written as YYYY-MM-DD (rejects 2026-02-30). */
export function isValidDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Today's date as YYYY-MM-DD in an IANA time zone (the bistro's day, not the visitor's). */
export function zonedToday(timeZone: string, now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export type MirrorHeading = { today: true; text: "Aujourd'hui" } | { today: false; text: 'Au menu' };

/**
 * "Aujourd'hui" only when the mirror's date is today in the bistro's zone; otherwise "Au menu".
 * Missing dates, other dates and an unknown "today" (no time zone, no JavaScript) all read "Au menu".
 */
export function mirrorHeading(date: string | undefined, today: string | undefined): MirrorHeading {
  return date && today && isValidDate(date) && date === today ? { today: true, text: "Aujourd'hui" } : { today: false, text: 'Au menu' };
}

/** "2026-11-17" → "mardi 17 novembre", written small on the mirror. */
export function formatMirrorDate(date: string): string {
  if (!isValidDate(date)) return '';
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date(`${date}T12:00:00Z`));
}
