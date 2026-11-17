import type { Metadata } from 'next';
import { BistroChair } from '../components/bistro-chair';
import { DietMarks } from '../components/carte-row';
import { DishArt } from '../components/dish-art';
import { FormuleSlates } from '../components/formule-slates';
import { GoogleMap } from '../components/google-map';
import { HoursTable } from '../components/hours-table';
import { Icon } from '../components/icons';
import { MirrorMenu } from '../components/mirror-menu';
import { Plaque } from '../components/plaque';
import { ServiceStatus } from '../components/service-status';
import { SiteLink } from '../components/site-link';
import { StreetLamp } from '../components/street-lamp';
import { TimeZoneNote } from '../components/time-zone-note';
import { WineList } from '../components/wine-list';
import { bistro, formatAddress, telHref } from '../content/bistro';
import { BADGES, featuredDishes, formatPrice } from '../content/menu';
import { featuredWines, usedMeasures } from '../content/wine';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl, menuAnchor } from '../lib/paths';
import { bistroStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

// Repeated text styles, kept here so every section matches.
const lede = 'max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted';
const sectionHead = 'mb-[clamp(1.75rem,4vw,2.75rem)] flex flex-wrap items-end justify-between gap-x-8 gap-y-4';
const ROMAN = ['I', 'II', 'III'];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(bistroStructuredData()) }} />

      {/* The mirror: today's menu, the service now, and where we are. */}
      <section className="pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)]" aria-labelledby="hero-title">
        <div className="wrap grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
          <div className="lg:col-start-2 lg:row-start-1 lg:self-end lg:pt-12">
            <p className="eyebrow" lang="fr">{bistro.tagline}</p>
            <h1 id="hero-title" className="mt-3 text-[clamp(2.3rem,6.2vw,5.2rem)] leading-[.95] lg:mt-4">{bistro.name}</h1>
            {/* On phones the mirror comes first, so the introduction moves below it. */}
            <p className="mt-5 max-w-[32rem] text-[clamp(1.08rem,1.5vw,1.22rem)] max-lg:hidden">{bistro.introduction}</p>
          </div>

          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <MirrorMenu />
          </div>

          <div className="lg:col-start-2 lg:row-start-2">
            <p className="mb-6 max-w-[32rem] text-[1.08rem] lg:hidden">{bistro.introduction}</p>
            <div className="brass-rule" aria-hidden="true" />
            <address className="mt-5 not-italic">
              <a href="#find-us" className="group inline-flex items-start gap-2.5 text-ink no-underline">
                <Icon name="pin" className="mt-1 flex-none text-accent" />
                <span>
                  <span className="block font-display text-[1.3rem] leading-tight group-hover:underline">{bistro.address.street}</span>
                  <span className="block text-muted">{bistro.address.locality}, {bistro.address.region} {bistro.address.postalCode}</span>
                </span>
              </a>
            </address>
            <p className="mt-6 flex flex-wrap gap-3">
              <SiteLink href="/menu/" className="button">See the carte <Icon name="arrow" width={18} height={18} /></SiteLink>
              <a href="#find-us" className="button button-ghost">Find us</a>
            </p>
            {bistro.phone ? (
              <p className="mt-6 flex items-center gap-3">
                <span className="grid size-11 flex-none place-items-center rounded-full border border-brass text-brass-ink"><Icon name="phone" /></span>
                <span>
                  <span className="block text-[.72rem] font-semibold tracking-[.2em] text-brass-ink uppercase" lang="fr">Téléphone</span>
                  <a href={telHref()} className="tabular font-display text-[1.45rem] leading-tight text-ink no-underline hover:text-accent">{bistro.phone}</a>
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Find us, under a plaque bearing the cross streets. */}
      <section id="find-us" className="border-y border-line bg-surface py-[clamp(3.5rem,7vw,5.5rem)]" aria-labelledby="find-us-title">
        <div className="wrap grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <Plaque id="find-us-title" tab={bistro.address.postalCode} size="lg">
              {bistro.address.crossStreets || 'Find us'}
            </Plaque>
            <p className="mt-6 text-[.78rem] font-semibold tracking-[.2em] text-brass-ink uppercase">Find us</p>
            <h3 className="mt-1 text-[clamp(1.6rem,3vw,2.1rem)]">{bistro.address.street}</h3>
            <p className="text-muted">{bistro.address.locality}, {bistro.address.region} {bistro.address.postalCode}</p>
            {bistro.address.note ? <p className="mt-2 text-[.96rem] italic">{bistro.address.note}</p> : null}
            <p className="mt-5 flex flex-wrap gap-3">
              <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
              <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
            </p>
            {bistro.directions.length ? (
              <ul className="mt-5 grid gap-1.5 text-[.96rem] text-muted">
                {bistro.directions.map(line => (
                  <li key={line} className="relative pl-5 before:absolute before:top-[.1em] before:left-0 before:text-brass before:content-['—']">{line}</li>
                ))}
              </ul>
            ) : null}
            {bistro.notice ? <p className="mt-5 border-l-2 border-accent bg-accent-soft px-4 py-3 font-semibold">{bistro.notice}</p> : null}

            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[1.4rem]" lang="fr">Les services</h3>
              <p className="text-[.82rem] font-semibold tracking-[.06em] text-muted"><ServiceStatus /></p>
            </div>
            <div className="mt-2"><HoursTable /></div>
            <TimeZoneNote />
          </div>

          <div className="grid grid-cols-[clamp(3.5rem,9vw,6.5rem)_minmax(0,1fr)] items-end gap-x-[clamp(.5rem,2vw,1.5rem)]">
            <StreetLamp className="w-full self-end print:hidden" />
            <div className="brass-frame">
              <GoogleMap className="min-h-[clamp(20rem,40vw,30rem)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Les formules on ardoises. */}
      <section className="wrap section-y" aria-labelledby="formules-title">
        <div className={sectionHead}>
          <div>
            <Plaque id="formules-title" tab="2"><span lang="fr">Les formules</span></Plaque>
            <p className={`mt-4 ${lede}`}>A prix-fixe at lunch and at dinner: choose from any dish marked <span className="font-semibold text-accent">✦ formule</span> on the carte.</p>
          </div>
          <SiteLink href="/menu/" className="text-link">See the whole carte</SiteLink>
        </div>
        <FormuleSlates />
      </section>

      {/* Suggestions du chef: featured dishes as carte entries with fine line drawings. */}
      <section className="wrap pb-(--space-section)" aria-labelledby="suggestions-title">
        <div className={sectionHead}>
          <div>
            <Plaque id="suggestions-title" tab="3"><span lang="fr">Suggestions du chef</span></Plaque>
            <p className={`mt-4 ${lede}`}>The dishes regulars come back for, cooked from the morning’s market.</p>
          </div>
        </div>
        <ul className="grid gap-x-14 border-t border-rule md:grid-cols-2">
          {featuredDishes.map(dish => (
            <li key={dish.id} className="border-b border-dotted border-line">
              <SiteLink href={menuAnchor(dish.id)} className="group flex items-center gap-[clamp(.9rem,2.5vw,1.5rem)] py-5 text-ink no-underline">
                {dish.art ? <DishArt art={dish.art} size={104} className="flex-none max-sm:w-[76px]" /> : null}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="dish-name text-[1.15rem] leading-snug group-hover:text-accent group-hover:underline" lang="fr">{dish.name}</span>
                    <DietMarks dish={dish} />
                    <span className="min-w-3 flex-1 -translate-y-1 border-b border-dotted border-rule" aria-hidden="true" />
                    <span className="tabular font-semibold">{formatPrice(dish.price)}</span>
                  </span>
                  <span className="mt-0.5 block text-[.95rem] text-muted italic">{dish.description}</span>
                  {dish.badge ? <span className="mt-1 block text-[.72rem] font-semibold tracking-[.14em] text-brass-ink uppercase" lang="fr">{BADGES[dish.badge].label}</span> : null}
                </span>
              </SiteLink>
            </li>
          ))}
        </ul>
      </section>

      {/* La cave: three featured wines under the measure vessels. */}
      <section className="border-y border-line bg-surface py-(--space-section)" aria-labelledby="cave-title">
        <div className="wrap grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)]">
          <div>
            <Plaque id="cave-title" tab="4"><span lang="fr">La cave</span></Plaque>
            <p className={`mt-5 ${lede}`}>
              Wine by the measure, as in Lyon: a <span lang="fr">verre</span>, a <span lang="fr">pot lyonnais</span> to share,
              a carafe or the bottle. Prices are only shown for the measures we pour.
            </p>
            <p className="mt-5"><SiteLink href="/wine/" className="text-link">The whole wine list</SiteLink></p>
            <p className="mt-3 text-[.88rem] text-muted">21+ with ID for alcohol. Sans alcool drinks are on the list too.</p>
          </div>
          <WineList wines={featuredWines} measures={usedMeasures(featuredWines)} uid="home" />
        </div>
      </section>

      {/* The bistro: a short story with three points and the bentwood chair. */}
      <section className="wrap section-y grid items-center gap-x-[clamp(2rem,6vw,5rem)] gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]" aria-labelledby="story-title">
        <div>
          <p className="eyebrow" lang="fr">Le bistro</p>
          <h2 id="story-title" className="mt-3 text-[clamp(2.1rem,4.4vw,3.3rem)]">Paper on the tables, the plat du jour on the mirror</h2>
          {bistro.story.map(paragraph => <p key={paragraph} className={`mt-5 ${lede}`}>{paragraph}</p>)}
          <ol className="mt-9 grid gap-6 sm:grid-cols-3">
            {bistro.storyPoints.map((point, index) => (
              <li key={point.title} className="border-t border-rule pt-4">
                <span className="font-display text-[1.05rem] text-brass-ink" aria-hidden="true">{ROMAN[index]}.</span>
                <h3 className="mt-1 text-[1.35rem]" lang="fr">{point.title}</h3>
                <p className="mt-1.5 text-[.96rem] text-muted">{point.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <BistroChair className="mx-auto w-full max-w-[24rem] print:hidden" />
      </section>

      {/* Private dining, groups and celebrations. */}
      <section className="wrap" aria-labelledby="salon-title">
        <div className="relative grid gap-x-10 gap-y-6 border border-rule bg-surface p-[clamp(1.5rem,4vw,3rem)] shadow-[inset_0_0_0_6px_var(--surface),inset_0_0_0_7px_var(--brass)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="eyebrow" lang="fr">Le salon</p>
            <h2 id="salon-title" className="mt-3 text-[clamp(1.9rem,3.6vw,2.7rem)]">Private dining, groups &amp; celebrations</h2>
            <p className={`mt-4 ${lede}`}>
              Small tables walk in. For six or more, a birthday at the long table or the private room for up to 18,
              send us an enquiry with the date and the number of guests, and we’ll reply to confirm.
            </p>
          </div>
          <p><SiteLink href="/contact/" className="button">Send an enquiry <Icon name="arrow" width={18} height={18} /></SiteLink></p>
        </div>
      </section>

      {/* FAQs */}
      {bistro.faqs.length ? (
        <section id="faq" className="wrap section-y" aria-labelledby="faq-title">
          <Plaque id="faq-title" tab="5">Questions</Plaque>
          <div className="mt-8 grid max-w-[52rem] border-t border-rule">
            {bistro.faqs.map(faq => (
              <details key={faq.question} className="faq border-b border-dotted border-rule">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 font-display text-[1.2rem] leading-snug">{faq.question}</summary>
                <p className="max-w-(--measure) pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">
            Something else? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink>
            {bistro.phone ? <> or call <a className="text-link" href={telHref()}>{bistro.phone}</a></> : null}.
          </p>
        </section>
      ) : null}
    </>
  );
}
