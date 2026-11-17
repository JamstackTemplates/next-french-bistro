import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { bistro, telHref } from '../../content/bistro';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Private dining, groups & celebrations',
  description: `Enquiries for groups of six or more, the private room and celebrations at ${bistro.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 text-[1.3rem]';
const USEFUL = [
  'The date you have in mind',
  'Déjeuner (lunch) or dîner (dinner)',
  'How many guests',
  'The occasion, if there is one',
  'Whether you’d like the private room',
  'Any dietary needs or allergies',
];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return (
    <>
      <PageHead eyebrow="Contact" title={<>Private dining, groups <span className="text-accent">&amp; celebrations</span></>}>
        <p>
          Small tables walk in, no booking needed. For six or more, the private room (up to 18 guests) or a celebration,
          send us an enquiry. A message is an enquiry, not a booking: nothing is reserved until we reply to confirm,
          usually within a day.
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(1rem,3vw,2rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={bistro.email} />
          ) : (
            <div className="grid justify-items-start gap-[1.1rem] border border-rule bg-surface p-[clamp(1.5rem,4vw,2.75rem)] shadow-[inset_0_0_0_6px_var(--surface),inset_0_0_0_7px_var(--brass)]">
              <p className="eyebrow" lang="fr">Écrivez-nous</p>
              <h2 className="text-[clamp(1.7rem,3vw,2.2rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us. Tell us the date, lunch or dinner, how many guests and what you’re
                celebrating, and we’ll reply to confirm what we can offer.
              </p>
              <p><a className="button" href={`mailto:${bistro.email}?subject=${encodeURIComponent('Group enquiry')}`}>Email {bistro.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-display text-[1.3rem] wrap-anywhere"><a className="text-link" href={`mailto:${bistro.email}`}>{bistro.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={bistro.email} /></p>

          {bistro.phone ? (
            <>
              <h2 className={`mt-4 ${subhead}`}>Phone</h2>
              <p><a className="text-link tabular" href={telHref()}>{bistro.phone}</a></p>
            </>
          ) : null}

          <h2 className={`mt-4 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {USEFUL.map(tip => (
              <li key={tip} className="relative pl-6 before:absolute before:top-0 before:left-0 before:text-brass before:content-['✦']">{tip}</li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-[.92rem] text-muted">
            Walking in? Tables for up to five and the terrace are first come, first served at every service.
          </p>
        </aside>
      </div>
    </>
  );
}
