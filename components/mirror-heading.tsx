'use client';

import { useEffect, useState } from 'react';
import { formatMirrorDate, mirrorHeading, zonedToday } from '../lib/mirror-date';

/**
 * The mirror's honest heading. The static HTML (and any visit without JavaScript or a time zone) reads
 * "Au menu" with the date written small. In the browser, only when the mirror's date is today in the
 * bistro's time zone does it switch to "Aujourd'hui". Checked again every minute, so it turns over at midnight.
 */
export function MirrorHeading({ date, className = '' }: { date?: string; className?: string }) {
  const [today, setToday] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Inlined at build time from site.config.json `timeZone` (see next.config.mjs).
    const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';
    if (!timeZone) return;
    const update = () => setToday(zonedToday(timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  const heading = mirrorHeading(date, today);
  const written = date ? formatMirrorDate(date) : '';
  return (
    <span className={className}>
      <span className="mirror__script block">{heading.text}</span>
      {!heading.today && written ? (
        <span className="mt-1 block font-sans text-[.78rem] font-medium tracking-[.14em] uppercase opacity-80">{written}</span>
      ) : null}
    </span>
  );
}
