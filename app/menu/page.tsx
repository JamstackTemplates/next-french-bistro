import type { Metadata } from 'next';
import { Carte } from '../../components/carte';
import { FormuleSlates } from '../../components/formule-slates';
import { MirrorStrip } from '../../components/mirror-menu';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { bistro } from '../../content/bistro';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'La carte',
  description: `Today’s plat du jour, the lunch formule and dinner prix-fixe, and the carte of entrées, plats, fromages and desserts at ${bistro.name}.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  return (
    <>
      <PageHead eyebrow="La carte" title={<>The carte, <span className="text-accent">the mirror</span> and the formules</>}>
        <p>
          French names, plain-English descriptions. The mirror changes with the market; the carte changes with the
          seasons. Dishes marked <span className="font-semibold text-accent">✦ formule</span> can be chosen for the
          lunch formule or the menu du soir.
        </p>
      </PageHead>

      <div className="wrap grid gap-[clamp(2.5rem,5vw,3.5rem)]">
        <MirrorStrip />
        <FormuleSlates />
      </div>

      <div className="wrap pt-[clamp(3rem,6vw,4.5rem)]">
        <Carte />
        <p className="mt-8 text-muted">
          Coming with a group, or celebrating? <SiteLink href="/contact/" className="text-link">Send us an enquiry</SiteLink>.
        </p>
      </div>
    </>
  );
}
