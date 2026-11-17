import { bistro, formatAddress, publicLinks, telHref } from '../content/bistro';
import { HoursTable } from './hours-table';
import { MosaicFloor } from './mosaic-floor';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 text-[.74rem] font-semibold tracking-[.2em] text-footer-muted uppercase';
const footerLink = 'text-footer-accent underline decoration-footer-accent/40 underline-offset-[.2em] hover:decoration-footer-accent';

/** The zinc counter with hours by service, contact details and links; then the brass foot-rail and the mosaic floor. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-[clamp(3rem,7vw,5rem)] bg-footer text-footer-ink">
      <div className="zinc-edge print:hidden" aria-hidden="true" />
      <div className="wrap grid gap-x-12 gap-y-9 pt-12 pb-8 md:grid-cols-2 lg:grid-cols-[1.25fr_1.2fr_.8fr]">
        <div>
          <p className="font-display text-[2rem] leading-none text-footer-accent">{bistro.name}</p>
          <p className="mt-2 mb-4 text-[.78rem] font-semibold tracking-[.22em] text-footer-muted uppercase" lang="fr">{bistro.tagline}</p>
          <address className="leading-[1.8] not-italic">
            {formatAddress()}<br />
            {bistro.phone ? <><a className={footerLink} href={telHref()}>{bistro.phone}</a><br /></> : null}
            <a className={footerLink} href={`mailto:${bistro.email}`}>{bistro.email}</a>
          </address>
          <p className="mt-4 inline-block border border-footer-muted/50 px-2.5 py-1 text-[.8rem] font-semibold tracking-[.08em]">21+ with ID for alcohol</p>
        </div>
        <div>
          <h2 className={heading}>Les services · hours</h2>
          <div className="text-[.95rem]"><HoursTable tone="footer" /></div>
          <TimeZoneNote className="text-footer-muted" />
        </div>
        <div>
          <h2 className={heading}>Around the bistro</h2>
          <ul className="grid gap-2 [&_a]:no-underline [&_a:hover]:text-footer-accent [&_a:hover]:underline">
            <li><SiteLink href="/menu/">La carte</SiteLink></li>
            <li><SiteLink href="/wine/">Wine by the measure</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Private dining &amp; groups</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-5 pb-7 text-[.86rem] text-footer-muted">
        <span>© {year} {bistro.name} · <span lang="fr">à bientôt</span></span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-footer-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
      <div className="foot-rail print:hidden" aria-hidden="true" />
      <MosaicFloor id="footer-floor" className="h-[clamp(4rem,9vw,6.5rem)] print:hidden" />
    </footer>
  );
}
