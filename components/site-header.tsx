import { DarkModeToggle } from 'jamstacks';
import { bistro } from '../content/bistro';
import { AwningScroll } from './awning-scroll';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Carte' },
  { href: '/wine/', label: 'Wine' },
  { href: '/contact/', label: 'Contact' },
];

/** "Bistro du Lampadaire" → ["Bistro du", "Lampadaire"]: the last word is lettered largest on narrow valances. */
function splitName(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)!] : ['', name];
}

/**
 * The awning: an oxblood-and-cream striped canopy over a scalloped valance with the name in gold.
 * Sticky; the canopy compresses to a slimmer edge on scroll (components/awning-scroll.tsx).
 */
export function SiteHeader() {
  const [lead, last] = splitName(bistro.name);
  return (
    <header className="awning">
      <div className="awning__canopy" aria-hidden="true" />
      <div className="awning__valance">
        <div className="wrap awning__row flex items-center justify-between gap-3 pb-1.5">
          <SiteLink href="/" className="awning__name font-display leading-none whitespace-nowrap no-underline">
            {lead ? <span className="max-sm:block max-sm:pb-0.5 max-sm:font-sans max-sm:text-[.6rem] max-sm:font-semibold max-sm:tracking-[.3em] max-sm:uppercase sm:text-[1.6rem]">{lead} </span> : null}
            <span className="text-[1.25rem] xs:text-[1.4rem] sm:text-[1.6rem]">{last}</span>
          </SiteLink>
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-5 print:hidden">
            <nav aria-label="Main">
              <ul className="flex gap-2.5 xs:gap-5 sm:gap-7">
                {navigation.map(item => (
                  <li key={item.href}>
                    <SiteLink href={item.href} markCurrent="section" className="awning__link py-2 text-[.9rem] font-semibold tracking-[.04em] xs:text-[.95rem] xs:tracking-[.06em] sm:text-[1rem]">
                      {item.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </nav>
            <DarkModeToggle className="flex-none" />
          </div>
        </div>
      </div>
      <AwningScroll />
    </header>
  );
}
