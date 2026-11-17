'use client';

import { useEffect, useState } from 'react';
import { bistro, type ServiceLabel } from '../content/bistro';
import { isServing, serviceState, zonedNow } from '../lib/services';

/** "Served now" on a formule slate, shown only while its service is on. Empty in the static HTML. */
export function ServedNow({ service }: { service: ServiceLabel }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Inlined at build time from site.config.json `timeZone` (see next.config.mjs).
    const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';
    if (!timeZone) return;
    const update = () => {
      const now = zonedNow(timeZone);
      setOn(isServing(serviceState(now.day, now.minutes, bistro.hours), service));
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [service]);

  if (!on) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-chalk/60 px-2.5 py-0.5 text-[.72rem] font-semibold tracking-[.12em] uppercase" data-tone="serving">
      <span className="status-dot" aria-hidden="true" />Served now
    </span>
  );
}
