# Bistro du Lampadaire (Next.js)

A Parisian bistro theme in oxblood, brass and cream: a striped awning, the day's menu hand-lettered on an antique mirror, a carte with prix-fixe formules, enamel street-plaque headings, wines by the glass, pot and bottle, lunch and dinner services, location and a [Jamstacks](https://jamstacks.net) contact component for private dining, groups and celebrations.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend. Light mode is *midi en terrasse*, lunch on the terrace; dark mode is *le soir au zinc*, lamplight at the bar. Both follow the visitor's device unless they pick one with the toggle on the awning.

**Bistro du Lampadaire**, its chef and story, the carte, the wine producers and the contact details are fictitious placeholders. The sample address is a public landmark, Lafayette Park in St. Louis, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | **The mirror**: today's entrée, plat and dessert hand-lettered on an antique bistro mirror, the formule prices and whether it's déjeuner or dîner now, beside the address, "See the carte", "Find us" and the phone. Then **Find us** (cross streets on an enamel plaque, directions, hours by service and the map beside the street lamp), **Les formules** on slates, **Suggestions du chef**, **La cave**, the bistro's story, private dining and FAQs |
| `/menu/` | La carte: a strip of today's mirror, the formule slates, then entrées, plats, fromages, desserts and café & digestifs in two printed columns under enamel plaques, with diet marks, formule marks, sold-out strike-throughs and vegetarian / vegan / no-shellfish filters |
| `/wine/` | La cave: the four measures drawn side by side, wines grouped by style with prices aligned under the vessels, "How we pour" and the sans alcool list |
| `/contact/` | Private dining, groups & celebrations: email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | "Cette page n'est plus à la carte", on the mosaic floor, with links back |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # mirror, carte, wine, services and configuration checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time.

## Make it yours

Every page reads from three content files:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | **The mirror** (top of the file), the formules, the carte sections and dishes, allergy notes, currency |
| [content/wine.ts](content/wine.ts) | Measures (verre, pot, carafe, bouteille), wines and their prices, sans alcool drinks, "How we pour" |
| [content/bistro.ts](content/bistro.ts) | Name, tagline, introduction, story, email, phone, address (with landmark `note` and `crossStreets`), directions, services per day, notice, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (including the mirror, slates, awning and lamp), fonts and other customizations |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, time zone and public deployment settings (see below) |

The bistro's name appears in two places only: `name` in `content/bistro.ts` and `name` in `site.config.json`. Renaming is a two-line change.

### Updating the mirror (the edit you'll make most)

```ts
export const mirror: Mirror = {
  date: '2026-11-17',                     // today, YYYY-MM-DD
  platDuJour: {                           // written out for the day…
    name: 'Blanquette de veau',
    description: 'Veal simmered in a creamy white sauce with button mushrooms and baby onions, with rice.',
    price: 29,
  },
  entreeDuJour: { id: 'poireaux-vinaigrette' }, // …or a dish from the carte, by id
  dessertDuJour: { id: 'tarte-tatin' },
  note: 'Bouillabaisse on Fridays',      // optional short line
};
```

The mirror is honest about its date. In the visitor's browser it compares `date` with today in *your* time zone: on that date it reads **"Aujourd'hui"**; on any other day (or with no date) it reads **"Au menu"** with the date written small, so the site never claims yesterday's dishes are today's. Without JavaScript it always reads "Au menu". `npm test` checks that the date is real and that carte ids exist and aren't sold out.

### Maintaining the carte

Each dish in `content/menu.ts` looks like this:

```ts
{
  id: 'boeuf-bourguignon',       // unique; also the link /menu/#boeuf-bourguignon
  name: 'Bœuf bourguignon',      // French, properly accented
  description: 'Beef braised for hours in red wine with carrots, mushrooms and lardons, with buttered potatoes.',
  price: 31,
  diet: ['gluten-free'],         // vegetarian, vegan, gluten-free, contains-nuts, contains-shellfish
  badge: 'maison',               // optional: 'maison' | 'saison' | 'new'
  formule: true,                 // optional: can be chosen for a formule
  featured: true,                // optional: "Suggestions du chef" on the home page (4–6 dishes)
  art: 'cocotte',                // drawing for featured dishes: cocotte, steak-frites, ramekin, cheese-board, bowl, tart
}
```

- **Sold out?** Add `soldOut: true`. The dish stays on the carte with a hand-drawn line through it and "plus disponible · sold out". Remove the line when it's back.
- **Seasonal dish:** add it with `badge: 'saison'`, and delete it when the season ends.
- **New section:** add `{ id, title, subtitle, description, course, dishes: [...] }` to `sections`. It gets its own enamel plaque and appears in the section links. Use `compact: true` for a short list like coffee.
- **Formules:** each has a `service` (`déjeuner` or `dîner`) and `options` such as `{ courses: ['entrée', 'plat'], price: 26 }`. Tests check that more courses cost more, and that each course has dishes marked `formule`. A formule shows "Served now" only while its service is on.
- **Prices** are numbers in `menu.currency` (`12` is $12, `4.5` is $4.50).
- `gluten-free` means gluten-free *ingredients*; the carte's notes explain the shared kitchen. Vegan dishes count as vegetarian in the filters.

### Wine by the measure

`measures` in `content/wine.ts` lists how you pour: verre (12cl), pot lyonnais (46cl), carafe (50cl) and bouteille (75cl). Rename one, or remove it, and the drawings and columns follow. Each wine lists `prices` only for the measures you pour it in: `prices: { verre: 9, pot: 28, bouteille: 42 }`. Tests check that every price names a defined measure, every wine has at least one price, and there are at least three sans alcool drinks. Use invented or generic names ("Rouge de la maison"), never a real château or brand.

### Services, hours and the status

`hours` in `content/bistro.ts` lists every day with its services in local time:

```ts
{ day: 'Tuesday', services: [{ label: 'Déjeuner', opens: '11:30', closes: '14:30' }, { label: 'Dîner', opens: '17:30', closes: '22:00' }] },
{ day: 'Sunday', services: [] },   // closed
```

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/Chicago`. If Jamstacks created this website, it's the time zone you chose in the portal. With it, the mirror and the Find us section show, computed in the visitor's browser from *your* clock and refreshed every minute:

- "Déjeuner · until 2:30pm" or "Dîner · kitchen until 10pm";
- "Between services · dîner from 5:30pm";
- "Closed today · déjeuner Tuesday from 11:30am".

The built files never contain a time-dependent claim: without JavaScript or a time zone they show the weekly services ("Déjeuner Tue – Fri · Dîner Tue – Sat"). Hours say "Times shown in Central Time" (or your zone). Tests check times are valid, in order and don't overlap. Use `notice` for one-off messages such as holiday closures.

### Location and map

The Find us section, the map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/bistro.ts`; the enamel plaque above it shows `crossStreets` with your postcode on its tab. All of them are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts).

The map is lazy-loaded, so Google is only contacted when it scrolls into view; Google may set cookies in it, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter`) dims it to match; set it to `none` for Google's normal colours.

## Appearance

The awning is the header: an oxblood-and-cream striped canopy over a scalloped valance with the name in gold. It compresses to a slimmer edge as the page scrolls. Section headings are generic Paris-style enamel street plaques; the formules are written on slates in oak frames; the footer is the zinc counter, its brass foot-rail and a cabochon mosaic floor.

All the illustrations (the mirror and its foxing, the banquette, the vessels, the dishes, the bentwood chair, the street lamp and the floor) are inline SVG and CSS coloured by tokens in `app/tailwind.input.css`. They change from lunch to lamplight with the theme; there are no image files to swap. The mirror's handwriting draws in once, and the street lamp flickers on once in dark mode; nothing loops, and both stop for visitors who prefer reduced motion.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts, all self-hosted through `@fontsource` packages under the SIL Open Font License:

- [Gloock](https://fonts.google.com/specimen/Gloock) for the name and headings;
- [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (variable, with a width axis) for the carte and UI, condensed and bold on the plaques;
- [Parisienne](https://fonts.google.com/specimen/Parisienne) for the handwriting on the mirror and slates only.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Bistro du Lampadaire",
  "description": "A corner bistro with a zinc bar and a small terrace: …",
  "domain": "next-french-bistro.jamstacks.net",
  "timeZone": "America/Chicago",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is set to this template's live demo, `next-french-bistro.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `bistro.example.com`), or set it to `""` if you don't have one yet; it's used for canonical links, the sitemap and social images.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for services (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-bistro` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS, the domain must be a bare hostname, the time zone a real IANA name, and the base path a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's certificate is provisioning. The build accepts it and emits HTTPS canonical, social and sitemap URLs. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (cuisine, address, services as opening hours, phone, menu link, `acceptsReservations: false` since small tables walk in and groups enquire) built from `content/bistro.ts`.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number and a "useful to include" list (date, déjeuner or dîner, guests, occasion, private room, dietary needs). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Private dining & groups", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, or the form is slow to appear, a short note offers the email instead. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval); no rebuild needed. Changing the carte, hours or the site ID does need a rebuild.
- The form supports name, email and message. A message is an **enquiry**: the page says nothing is booked until you reply to confirm. Don't promise reservations, ordering or extra fields in your page copy.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css); the primary stays deep oxblood in both themes so the form's white button text is readable. A theme you publish in the portal overrides these. Don't style the component's internals.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets; they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/bistro-preview npm run build
node scripts/serve.mjs --base /bistro-preview   # http://localhost:3000/bistro-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, and put the same hostname in `domain` in `site.config.json`. Deployments from GitHub Actions ignore a `CNAME` file, so don't add one.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal.

## Project structure

```
app/                    routes (/, /menu/, /wine/, /contact/, 404), metadata, sitemap/robots, styles and tokens
components/             awning header, mirror, plaques, slates, carte, wine list and vessels, drawings, footer, Jamstacks host/loader
content/                menu.ts (mirror, formules, carte), wine.ts and bistro.ts — your content
lib/services.ts         services, the status ("Déjeuner · until 2:30pm") and hours by service
lib/mirror-date.ts      the mirror's honest "Aujourd'hui" date check
lib/menu-filter.ts      carte filter rules
lib/config.mjs          build-time public config resolution and validation
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/jamstacks.d.ts    typed JSX for <jamstacks-support-form>
public/                 social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Bistro du Lampadaire (in `content/bistro.ts` and `site.config.json`), the story, address (with `note` and `crossStreets`), directions, email, phone, carte, formules, wine list, FAQs and social links with your own details.
- Set your real services and `timeZone`, update the mirror with today's `date`, and check the status and "Aujourd'hui" on the home page.
- Replace the demo `domain` in `site.config.json` with yours (or `""`), and update the title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches your inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed; Jamstacks provisioning removes it after verifying it.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
