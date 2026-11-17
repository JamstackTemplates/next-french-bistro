import { bistro } from '../content/bistro';
import { closedDays, hoursByService } from '../lib/services';

/** Hours by service (déjeuner, dîner) and the closed days, built from content/bistro.ts. */
export function HoursTable({ tone = 'page' }: { tone?: 'page' | 'footer' }) {
  const rows = hoursByService(bistro.hours);
  const closed = closedDays(bistro.hours);
  const rule = tone === 'footer' ? 'border-white/15' : 'border-line';
  const label = tone === 'footer' ? 'text-footer-accent' : 'text-brass-ink';
  return (
    <dl className="grid">
      {rows.map(row => (
        <div key={`${row.label}-${row.days}-${row.hours}`} className={`grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-x-3 border-b border-dotted ${rule} py-2`}>
          <dt className={`font-display text-[1.05rem] ${label}`} lang="fr">{row.label}</dt>
          <dd>{row.days}</dd>
          <dd className="tabular text-right whitespace-nowrap">{row.hours}</dd>
        </div>
      ))}
      {closed ? (
        <div className={`grid grid-cols-[5.5rem_1fr] items-baseline gap-x-3 border-b border-dotted ${rule} py-2`}>
          <dt className={`font-display text-[1.05rem] ${label}`} lang="fr">Fermé</dt>
          <dd>Closed {closed}</dd>
        </div>
      ) : null}
    </dl>
  );
}
