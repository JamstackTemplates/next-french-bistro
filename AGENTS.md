# Working on this website

This is a customer-owned Next.js website for a French bistro. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample bistro, chef story,
  carte, wine list, address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the day's **mirror** (at the top of the file: `date`, `platDuJour`, `entreeDuJour`,
  `dessertDuJour`, `note`), the **formules** (prix-fixe options per service), and the **carte** sections and dishes:
  French name, English description, price, diet marks, `badge` (`maison` | `saison` | `new`), `formule`, `featured`
  (home page "Suggestions du chef", needs an `art` drawing) and `soldOut`.
  Most owner requests ("today's plat is a cassoulet", "the sole is sold out", "raise the formule to $28") are edits here only.
- "Update the mirror" means: change the three dishes (by carte `id`, or written out with name, description and price)
  and set `mirror.date` to today as `YYYY-MM-DD`. Only a matching date in the bistro's time zone shows "Aujourd'hui";
  otherwise the mirror honestly reads "Au menu" with the date. Never remove this check.
- `content/wine.ts` owns the measures (verre, pot lyonnais, carafe, bouteille: rename or remove them there),
  the wines with `prices` keyed by measure id, the sans alcool list and the "How we pour" note.
  Wine names must stay invented or generic, never a real château, domaine or brand; appellations are real places.
- `content/bistro.ts` owns the name, tagline, introduction, story and its three points, email, phone, address
  (with a landmark `note` and the `crossStreets` shown on the Find us plaque), directions, services per day
  (`{ label: 'Déjeuner' | 'Dîner', opens, closes }`, `[]` = closed), notice, amenities, FAQs and social links.
- The business name lives in `content/bistro.ts` and `site.config.json` `name` only: renaming is a two-line change.
- The address drives the Find us section, the Google map, directions links and structured data. Maps use keyless
  Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there). Change it
  there, not in content; without it the service status shows the weekly services and the mirror reads "Au menu".
- Keep ids unique, lowercase and hyphenated (`[a-z0-9-]`); they are page anchors (`/menu/#steak-frites`, `/wine/#cuvee-du-zinc`).
  Mark dishes `soldOut: true` rather than deleting them. Use an existing `art` drawing; don't add image files.
- Colours, including the mirror, slates, awning, lamp and floor, are tokens in `app/tailwind.input.css` (see Styling).
- Keep content out of `site.config.json`: Jamstacks may rewrite it wholesale. The time zone does belong there.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business. Keep wine copy about
  enjoying, never excess, and keep "21+ with ID" visible wherever alcohol is listed.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds everything utilities can't express: the colour tokens (`:root` for light,
  plus two dark blocks that must stay identical), the `@theme` built from them, base element styles,
  shared building blocks (`.button`, `.button-ghost`, `.text-link`, `.eyebrow`, `.brass-rule`, `.plaque`, `.ardoise`,
  `.mark`, `.filter`), the illustrations and animation (awning, mirror, vessels, lamp, foot-rail, floor) and styles
  driven by data attributes (`data-tone`, `data-sold-out`, `data-state`).
- Only this template's palette exists (`bg`, `surface`, `ink`, `muted`, `line`, `rule`, `accent`, `button`, `brass`,
  `brass-ink`, `enamel`, `veg`, `valance`, `gold`, `chalk`, `footer` and their variants). Tailwind's default colours are
  switched off. To add a colour, add a variable to `:root` and both dark blocks, then map it in
  `@theme inline` as `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
- Reuse the building blocks and components (`Plaque` for section headings, `CarteRow`, `WineList`, `PageHead`)
  instead of restyling each instance. Add a reusable layout helper with `@utility`.
- Keep the `--jamstacks-*` variables mapped to the tokens and `--jamstacks-color-primary` dark enough for white
  button text. Preserve readable contrast in both themes (white writing on the mirror needs its dark glass),
  layouts from 360px, the one-line header at 390px, visible keyboard focus, semantic headings, `lang="fr"` on
  French text, and reduced-motion support (the mirror's write-in, the lamp flicker and the awning compression all stop).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no
  request-time rendering, API routes, Server Actions, middleware, database or production Next.js server.
- Use local content for pages and ordinary client code for browser-only interactions
  (the service status, the mirror's "Aujourd'hui" check, "served now" on the formules, carte filters, the awning on scroll,
  the copy button). Time-dependent text is computed in the browser from the bistro's time zone, never at build time;
  the logic lives in `lib/services.ts` and `lib/mirror-date.ts` with unit tests.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths.
  Use the shared path helpers and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before
  changing framework behavior. Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>`
  with `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at
  `/sites/{publicSiteId}/embed.js`, on the Contact page only; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission.
  Do not copy it, register a replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount
  contract is available. Keep the email visible beside the form, including during outages.
- The form supports name, email and message. Page copy must present a message as an enquiry, never a booking,
  and must not promise reservations, ordering, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials,
  publishing keys or private notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated
  run name when changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # mirror, carte, formules, wine, services, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/bistro-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the dish, wine, formule or day to fix.
`npm start` previews the export on port 3000; stop the dev server first, or use
`npm start -- --port 3200`. Browser-check affected routes in light and dark, at desktop and 390px, and
root/project-path assets when changing layout, navigation or deployment behavior. Report local
checks separately from any actual GitHub deployment or delivered contact message.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import or read it.
- Keep `site.config.json`, embed integration and the Pages workflow outside the optional folder.
