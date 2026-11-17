// Content invariants for the bistro, its carte, the mirror and the cave. Runs with Node's built-in
// TypeScript type stripping. When one of these fails after an edit, the message names the item or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { bistro, formatAddress, publicLinks } from '../content/bistro.ts';
import {
  allDishes, BADGES, COURSES, DIETS, DISH_ARTS, featuredDishes, findDish, formatCourses, formatPrice, menu, mirror,
  resolveMirrorDish, type MirrorDish,
} from '../content/menu.ts';
import { cave, featuredWines, STYLES, usedMeasures, VESSEL_ICONS, winesByStyle } from '../content/wine.ts';
import { matchesAll, matchesFilter } from '../lib/menu-filter.ts';
import { DAYS, SERVICE_LABELS, TIME, toMinutes } from '../lib/services.ts';
import { isValidDate } from '../lib/mirror-date.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

function assertIds(ids: string[], what: string) {
  for (const id of ids) assert.match(id, SLUG, `${what} id "${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `${what} ids must be unique: ${duplicates.join(', ')}`);
}

/* ---------- The mirror ---------- */

test('the mirror’s date is a real YYYY-MM-DD date (or left out)', () => {
  if (mirror.date !== undefined) assert.ok(isValidDate(mirror.date), `mirror.date "${mirror.date}" must be a real date written YYYY-MM-DD, or removed`);
});

test('the mirror’s dishes exist on the carte and aren’t sold out', () => {
  const slots: [string, MirrorDish][] = [['platDuJour', mirror.platDuJour], ['entreeDuJour', mirror.entreeDuJour], ['dessertDuJour', mirror.dessertDuJour]];
  for (const [slot, dish] of slots) {
    if ('id' in dish) {
      const found = findDish(dish.id);
      assert.ok(found, `mirror.${slot}: no carte dish has id "${dish.id}"`);
      assert.ok(!found.soldOut, `mirror.${slot}: "${dish.id}" is marked soldOut on the carte; pick another dish for the mirror`);
    } else {
      assert.ok(dish.name.trim(), `mirror.${slot}.name`);
      assert.ok(dish.description.trim(), `mirror.${slot}.description`);
      assert.ok(validPrice(dish.price), `mirror.${slot}.price ${dish.price}`);
    }
    assert.ok(resolveMirrorDish(dish), `mirror.${slot}`);
  }
  if (mirror.note !== undefined) assert.ok(mirror.note.trim().length <= 60, 'mirror.note should be a short line (60 characters or fewer)');
});

/* ---------- The carte ---------- */

test('carte sections and dishes have unique, URL-safe ids', () => {
  assert.ok(menu.sections.length >= 1, 'Add at least one carte section.');
  assertIds([...menu.sections.map(section => section.id), ...allDishes.map(dish => dish.id), ...menu.formules.map(f => f.id)], 'carte');
});

test('every section and dish is complete', () => {
  for (const section of menu.sections) {
    assert.ok(section.title.trim() && section.subtitle.trim() && section.description.trim(), `section ${section.id}: title, subtitle and description`);
    assert.ok(section.dishes.length >= 1, `section ${section.id} has no dishes`);
    if (section.course) assert.ok(COURSES.includes(section.course), `section ${section.id} has unknown course "${section.course}"`);
  }
  for (const dish of allDishes) {
    assert.ok(dish.name.trim(), `${dish.id}.name`);
    assert.ok(dish.description.trim(), `${dish.id}.description`);
    assert.ok(validPrice(dish.price), `${dish.id} price ${dish.price} must be positive with at most two decimals`);
    for (const diet of dish.diet ?? []) assert.ok(diet in DIETS, `${dish.id} has unknown diet "${diet}"`);
    assert.equal(new Set(dish.diet).size, dish.diet?.length ?? 0, `${dish.id} repeats a diet tag`);
    if (dish.diet?.includes('vegan')) assert.ok(!dish.diet.includes('vegetarian'), `${dish.id}: vegan already counts as vegetarian; remove "vegetarian"`);
    if (dish.badge) assert.ok(dish.badge in BADGES, `${dish.id} has unknown badge "${dish.badge}"`);
    if (dish.art) assert.ok(DISH_ARTS.includes(dish.art), `${dish.id}.art must be one of ${DISH_ARTS.join(', ')}`);
  }
});

test('French dish names keep their accents', () => {
  // Common slips when typing on an English keyboard.
  const unaccented = [/\boeuf\b/i, /\bcreme\b/i, /\bile flottante\b/i, /\bpate en croute\b/i, /\bmariniere\b/i, /\bmeuniere\b/i, /\bentrees?\b/i];
  for (const dish of allDishes) {
    for (const pattern of unaccented) assert.doesNotMatch(dish.name, pattern, `${dish.id}: write the French name with its accents (${dish.name})`);
  }
});

test('the carte covers sold-out, vegetarian and vegan dishes', () => {
  assert.ok(allDishes.some(dish => dish.soldOut), 'Mark at least one dish soldOut to show the strike-through (sample content).');
  const vegetarian = allDishes.filter(dish => matchesFilter(dish, 'vegetarian') && !menu.sections.find(s => s.dishes.includes(dish))?.compact);
  const vegan = allDishes.filter(dish => matchesFilter(dish, 'vegan') && !menu.sections.find(s => s.dishes.includes(dish))?.compact);
  assert.ok(vegetarian.length >= 5, `Only ${vegetarian.length} vegetarian dishes; aim for at least five`);
  assert.ok(vegan.length >= 2, `Only ${vegan.length} vegan dishes; aim for at least two`);
});

test('suggestions du chef: 4–6 featured dishes, each with a drawing and not sold out', () => {
  assert.ok(featuredDishes.length >= 4 && featuredDishes.length <= 6, `Mark 4–6 dishes featured: true (now ${featuredDishes.length})`);
  for (const dish of featuredDishes) {
    assert.ok(dish.art, `${dish.id} is featured, so give it an art drawing (${DISH_ARTS.join(', ')})`);
    assert.ok(!dish.soldOut, `${dish.id} is featured but sold out`);
  }
});

test('formules use known courses, eligible dishes exist, and prices rise with more courses', () => {
  assert.ok(menu.formules.length >= 1, 'Add at least one formule');
  for (const formule of menu.formules) {
    assert.ok(formule.name.trim() && formule.when.trim() && formule.note.trim(), `formule ${formule.id}: name, when and note`);
    assert.ok(['déjeuner', 'dîner'].includes(formule.service), `formule ${formule.id}.service must be "déjeuner" or "dîner"`);
    assert.ok(formule.options.length >= 1, `formule ${formule.id} needs at least one option`);
    for (const option of formule.options) {
      const label = `formule ${formule.id} option ${option.courses.join('+')}`;
      assert.ok(option.courses.length >= 1, `${label}: list its courses`);
      for (const course of option.courses) assert.ok(COURSES.includes(course), `${label}: unknown course "${course}" (use ${COURSES.join(', ')})`);
      assert.equal(new Set(option.courses).size, option.courses.length, `${label} repeats a course`);
      assert.ok(validPrice(option.price), `${label} price ${option.price}`);
      for (const course of option.courses) {
        assert.ok(allDishes.some(dish => dish.formule && menu.sections.find(s => s.dishes.includes(dish))?.course === course),
          `${label}: no dish in a "${course}" section is marked formule: true`);
      }
    }
    for (const a of formule.options) {
      for (const b of formule.options) {
        if (a.courses.length < b.courses.length) {
          assert.ok(a.price < b.price, `formule ${formule.id}: ${formatCourses(b.courses)} ($${b.price}) must cost more than ${formatCourses(a.courses)} ($${a.price})`);
        }
      }
    }
  }
  assert.equal(formatCourses(['entrée', 'plat']), 'Entrée + plat');
});

test('filters: vegan implies vegetarian; no-shellfish hides shellfish', () => {
  assert.ok(matchesFilter({ diet: ['vegan'] }, 'vegetarian'));
  assert.ok(!matchesFilter({ diet: ['vegetarian'] }, 'vegan'));
  assert.ok(!matchesFilter({ diet: ['contains-shellfish'] }, 'no-shellfish'));
  assert.ok(matchesFilter({}, 'no-shellfish'));
  assert.ok(matchesAll({ diet: ['vegan'] }, []));
  assert.ok(!matchesAll({ diet: ['vegan', 'contains-shellfish'] }, ['vegan', 'no-shellfish']));
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(4.5), '$4.50');
  assert.equal(formatPrice(12), '$12');
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
});

/* ---------- La cave ---------- */

test('measures are complete with unique ids and known drawings', () => {
  assert.ok(cave.measures.length >= 1, 'Define at least one measure');
  assertIds(cave.measures.map(m => m.id), 'measure');
  for (const measure of cave.measures) {
    assert.ok(measure.label.trim() && measure.volume.trim(), `measure ${measure.id}: label and volume`);
    assert.ok(VESSEL_ICONS.includes(measure.icon), `measure ${measure.id}.icon must be one of ${VESSEL_ICONS.join(', ')}`);
  }
});

test('every wine is complete, priced in at least one defined measure, with a known style', () => {
  assert.ok(cave.wines.length >= 1, 'Add at least one wine');
  assertIds(cave.wines.map(w => w.id), 'wine');
  const measureIds = cave.measures.map(m => m.id);
  for (const wine of cave.wines) {
    for (const key of ['name', 'appellation', 'region', 'notes'] as const) assert.ok(wine[key].trim(), `${wine.id}.${key}`);
    assert.ok(wine.style in STYLES, `${wine.id}.style "${wine.style}" must be one of ${Object.keys(STYLES).join(', ')}`);
    assert.ok(wine.grapes.length >= 1 && wine.grapes.every(g => g.trim()), `${wine.id}.grapes`);
    const prices = Object.entries(wine.prices);
    assert.ok(prices.length >= 1, `${wine.id} needs a price for at least one measure`);
    for (const [measure, price] of prices) {
      assert.ok(measureIds.includes(measure), `${wine.id} has a price for "${measure}", which isn't a defined measure (${measureIds.join(', ')})`);
      assert.ok(validPrice(price), `${wine.id} ${measure} price ${price}`);
    }
  }
});

test('the list starts with house wines and keeps featured wines sensible', () => {
  assert.match(cave.wines[0]?.name ?? '', /maison/i, 'List a house wine (“… de la maison”) first');
  assert.ok(featuredWines.length >= 1 && featuredWines.length <= 3, `Mark 1–3 wines featured: true for the home page (now ${featuredWines.length})`);
  for (const wine of featuredWines) assert.ok(!wine.soldOut, `${wine.id} is featured but sold out`);
  assert.equal(winesByStyle().reduce((sum, group) => sum + group.wines.length, 0), cave.wines.length);
  assert.deepEqual(usedMeasures([{ ...cave.wines[0], prices: { bouteille: 40 } }]).map(m => m.id), ['bouteille']);
});

test('there are at least three non-alcoholic drinks', () => {
  assert.ok(cave.sansAlcool.length >= 3, 'List at least three sans alcool drinks');
  assertIds(cave.sansAlcool.map(d => d.id), 'sans alcool');
  for (const drink of cave.sansAlcool) assert.ok(drink.name.trim() && drink.description.trim() && validPrice(drink.price), `sans alcool ${drink.id}`);
  assert.ok(cave.howWePour.length >= 1, 'Keep a short “How we pour” note');
});

/* ---------- The bistro ---------- */

test('services list each day once, Monday first, with valid, ordered, non-overlapping times', () => {
  assert.deepEqual(bistro.hours.map(entry => entry.day), [...DAYS], 'hours must list Monday to Sunday, once each');
  for (const entry of bistro.hours) {
    let previousClose = -1;
    for (const service of entry.services) {
      assert.ok(SERVICE_LABELS.includes(service.label), `${entry.day}: service label must be ${SERVICE_LABELS.join(' or ')}`);
      assert.match(service.opens, TIME, `${entry.day} ${service.label}.opens must be "HH:MM"`);
      assert.match(service.closes, TIME, `${entry.day} ${service.label}.closes must be "HH:MM"`);
      assert.ok(toMinutes(service.opens) < toMinutes(service.closes), `${entry.day} ${service.label} must open before it closes`);
      assert.ok(toMinutes(service.opens) >= previousClose, `${entry.day}: ${service.label} overlaps or comes before the previous service; list services in order`);
      previousClose = toMinutes(service.closes);
    }
  }
});

test('contact details and links are publishable', () => {
  assert.match(bistro.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.equal(bistro.storyPoints.length, 3, 'Keep exactly three story points');
  assert.ok(bistro.amenities.length >= 1 && bistro.faqs.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Chicago'), 'Central Time');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(bistro.address[key].trim(), `address.${key}`);
  assert.match(bistro.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, 'Lafayette Park, 2023 Lafayette Ave, St. Louis, MO 63104');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=Lafayette%20Park'));
  assert.ok(mapEmbedUrl('Shop! 1').includes('1sShop%21+1!6i16'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
