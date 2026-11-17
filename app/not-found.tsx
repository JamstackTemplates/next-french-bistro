import type { Metadata } from 'next';
import { MosaicFloor } from '../components/mosaic-floor';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

/** A friendly 404: a little carte card laid on the mosaic floor. */
export default function NotFound() {
  return (
    <section className="relative -mb-[clamp(3rem,7vw,5rem)] grid place-items-center overflow-hidden px-(--gutter) py-[clamp(4rem,10vw,8rem)]" aria-labelledby="not-found-title">
      <MosaicFloor id="not-found-floor" className="absolute inset-0 h-full" />
      <div className="relative w-full max-w-[34rem] border border-rule bg-surface p-[clamp(1.75rem,5vw,3rem)] text-center shadow-[inset_0_0_0_6px_var(--surface),inset_0_0_0_7px_var(--brass),0_30px_60px_-20px_rgb(0_0_0/.5)]">
        <p className="eyebrow">404</p>
        <h1 id="not-found-title" className="mt-4 text-[clamp(2rem,5vw,2.8rem)]">
          <span lang="fr">Cette page n’est plus à la carte</span>
        </h1>
        <p className="mt-3 font-script text-[1.8rem] text-accent">this page is off the menu…</p>
        <p className="mt-4 text-muted">The link may be out of date, or the page may have moved. Try one of these:</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          <li><SiteLink href="/" className="button">Home</SiteLink></li>
          <li><SiteLink href="/menu/" className="button button-ghost">La carte</SiteLink></li>
          <li><SiteLink href="/#find-us" className="button button-ghost">Find us</SiteLink></li>
        </ul>
      </div>
    </section>
  );
}
