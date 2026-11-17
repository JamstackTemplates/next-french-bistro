'use client';

import { useEffect, useState } from 'react';
import { bistro } from '../content/bistro';
import { describeService, serviceState, servicesSummary, zonedNow, type ServiceTone } from '../lib/services';

/**
 * "Déjeuner · until 2:30pm" / "Between services · dîner from 5:30pm" / "Closed today · …".
 * The static HTML shows the weekly services ("Déjeuner Tue – Fri · Dîner Tue – Sat") with no claim about
 * now; the browser fills in the live state after hydration from the bistro's own time zone (so the build
 * never bakes in the time it ran) and refreshes it every minute. Without a time zone the summary stays.
 */
export function ServiceStatus({ className = '' }: { className?: string }) {
  const [label, setLabel] = useState<{ text: string; tone: ServiceTone } | null>(null);

  useEffect(() => {
    // Inlined at build time from site.config.json `timeZone` (see next.config.mjs).
    const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';
    if (!timeZone) return;
    const update = () => {
      const now = zonedNow(timeZone);
      setLabel(describeService(serviceState(now.day, now.minutes, bistro.hours)));
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-tone={label?.tone}>
      <span className="status-dot" aria-hidden="true" />
      <span role="status" aria-live="polite" aria-atomic="true">{label?.text ?? servicesSummary(bistro.hours)}</span>
    </span>
  );
}
