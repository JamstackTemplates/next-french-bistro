import { formatCourses, formatPrice, menu, type Formule } from '../content/menu';
import type { ServiceLabel } from '../lib/services';
import { ServedNow } from './served-now';

const SERVICE: Record<Formule['service'], ServiceLabel> = { 'déjeuner': 'Déjeuner', 'dîner': 'Dîner' };

/** The formules on ardoises: small black slates in oak frames, leaning beside the carte. */
export function FormuleSlates({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-x-8 gap-y-10 md:grid-cols-2 ${className}`}>
      {menu.formules.map((formule, index) => (
        <article key={formule.id} id={formule.id} aria-labelledby={`${formule.id}-title`}
          className={`ardoise ${index % 2 ? 'md:rotate-[1.1deg]' : 'md:-rotate-[.9deg]'}`}>
          <div className="ardoise__slate">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h3 id={`${formule.id}-title`} className="font-script text-[clamp(2.1rem,4vw,2.6rem)] leading-none" lang="fr">{formule.name}</h3>
              <ServedNow service={SERVICE[formule.service]} />
            </div>
            <p className="mt-2 text-[.78rem] font-semibold tracking-[.16em] text-chalk/75 uppercase">{formule.when}</p>
            <ul className="mt-4 grid gap-2.5">
              {formule.options.map(option => (
                <li key={option.courses.join('+')} className="flex items-baseline gap-3">
                  <span className="font-script text-[1.65rem] leading-tight" lang="fr">{formatCourses(option.courses)}</span>
                  <span className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-chalk/35" aria-hidden="true" />
                  <span className="tabular text-[1.15rem] font-semibold">{formatPrice(option.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[.92rem] leading-snug text-chalk/80 italic">{formule.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
