// The service status and the mirror's honest date: pure logic, so every case runs without a browser or a clock.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  closedDays, dayRanges, describeService, hoursByService, isServing, serviceState, servicesSummary, toMinutes, zonedNow,
  type DayHours,
} from '../lib/services.ts';
import { formatMirrorDate, isValidDate, mirrorHeading, zonedToday } from '../lib/mirror-date.ts';

const dejeuner = { label: 'Déjeuner', opens: '11:30', closes: '14:30' } as const;
const diner = { label: 'Dîner', opens: '17:30', closes: '22:00' } as const;
const week: DayHours[] = [
  { day: 'Monday', services: [] },
  { day: 'Tuesday', services: [dejeuner, diner] },
  { day: 'Wednesday', services: [dejeuner, diner] },
  { day: 'Thursday', services: [dejeuner, diner] },
  { day: 'Friday', services: [dejeuner, diner] },
  { day: 'Saturday', services: [diner] },
  { day: 'Sunday', services: [] },
];
const status = (day: DayHours['day'], time: string, hours = week) => describeService(serviceState(day, toMinutes(time), hours));

test('before opening', () => {
  assert.deepEqual(status('Tuesday', '09:00'), { text: 'Opens today · déjeuner from 11:30am', tone: 'closed' });
  assert.deepEqual(status('Saturday', '12:00'), { text: 'Opens today · dîner from 5:30pm', tone: 'closed' });
});

test('during déjeuner', () => {
  assert.deepEqual(status('Wednesday', '11:30'), { text: 'Déjeuner · until 2:30pm', tone: 'serving' });
  assert.deepEqual(status('Wednesday', '14:29'), { text: 'Déjeuner · until 2:30pm', tone: 'serving' });
});

test('between services', () => {
  assert.deepEqual(status('Thursday', '14:30'), { text: 'Between services · dîner from 5:30pm', tone: 'between' });
  assert.deepEqual(status('Thursday', '17:29'), { text: 'Between services · dîner from 5:30pm', tone: 'between' });
});

test('during dîner', () => {
  assert.deepEqual(status('Thursday', '17:30'), { text: 'Dîner · kitchen until 10pm', tone: 'serving' });
  assert.deepEqual(status('Saturday', '21:59'), { text: 'Dîner · kitchen until 10pm', tone: 'serving' });
});

test('after closing', () => {
  assert.deepEqual(status('Thursday', '22:00'), { text: 'Closed for the night · déjeuner tomorrow from 11:30am', tone: 'closed' });
  // Friday night → Saturday has dinner only.
  assert.deepEqual(status('Friday', '23:30'), { text: 'Closed for the night · dîner tomorrow from 5:30pm', tone: 'closed' });
});

test('closed Sunday and Monday, and the next opening across them', () => {
  // Saturday night skips Sunday and Monday.
  assert.deepEqual(status('Saturday', '22:30'), { text: 'Closed for the night · déjeuner Tuesday from 11:30am', tone: 'closed' });
  assert.deepEqual(status('Sunday', '12:00'), { text: 'Closed today · déjeuner Tuesday from 11:30am', tone: 'closed' });
  assert.deepEqual(status('Monday', '19:00'), { text: 'Closed today · déjeuner tomorrow from 11:30am', tone: 'closed' });
  // A week with one service still finds it, wrapping round the week.
  const once: DayHours[] = week.map(entry => ({ ...entry, services: entry.day === 'Thursday' ? [diner] : [] }));
  assert.deepEqual(status('Thursday', '23:00', once), { text: 'Closed for the night · dîner Thursday from 5:30pm', tone: 'closed' });
  assert.deepEqual(status('Monday', '10:00', once), { text: 'Closed today · dîner Thursday from 5:30pm', tone: 'closed' });
  // No services at all never claims an opening.
  assert.deepEqual(status('Monday', '13:00', week.map(entry => ({ ...entry, services: [] }))), { text: 'Closed today', tone: 'closed' });
});

test('a formule is "served now" only during its own service', () => {
  const lunch = serviceState('Tuesday', toMinutes('12:00'), week);
  const dinner = serviceState('Tuesday', toMinutes('19:00'), week);
  const between = serviceState('Tuesday', toMinutes('15:00'), week);
  assert.ok(isServing(lunch, 'Déjeuner') && !isServing(lunch, 'Dîner'));
  assert.ok(isServing(dinner, 'Dîner') && !isServing(dinner, 'Déjeuner'));
  assert.ok(!isServing(between, 'Déjeuner') && !isServing(between, 'Dîner'));
});

test('the weekly summary and hours by service read naturally', () => {
  assert.equal(servicesSummary(week), 'Déjeuner Tue – Fri · Dîner Tue – Sat');
  assert.equal(closedDays(week), 'Sun & Mon');
  assert.equal(closedDays(week.map(entry => ({ ...entry, services: [diner] }))), '');
  assert.equal(dayRanges(['Tuesday', 'Wednesday', 'Thursday', 'Saturday']), 'Tue – Thu, Saturday');
  assert.equal(dayRanges(['Friday', 'Saturday']), 'Fri & Sat');
  assert.deepEqual(hoursByService(week), [
    { label: 'Déjeuner', days: 'Tue – Fri', hours: '11:30am – 2:30pm' },
    { label: 'Dîner', days: 'Tue – Sat', hours: '5:30pm – 10pm' },
  ]);
});

test('the browser clock is read in the bistro’s time zone', () => {
  // 2026-01-14 is a Wednesday. 01:30 UTC is 7:30pm on Tuesday in Chicago (UTC−6).
  assert.deepEqual(zonedNow('America/Chicago', new Date('2026-01-14T01:30:00Z')), { day: 'Tuesday', minutes: 19 * 60 + 30 });
  // Daylight saving: 2026-07-15 17:05 UTC is 12:05pm in Chicago (UTC−5).
  assert.deepEqual(zonedNow('America/Chicago', new Date('2026-07-15T17:05:00Z')), { day: 'Wednesday', minutes: 12 * 60 + 5 });
});

test('the mirror says "Aujourd’hui" only on its own date', () => {
  const today = zonedToday('America/Chicago', new Date('2026-11-17T18:00:00Z'));
  assert.equal(today, '2026-11-17');
  assert.deepEqual(mirrorHeading('2026-11-17', today), { today: true, text: "Aujourd'hui" });
  // Yesterday's mirror never claims to be today's.
  assert.deepEqual(mirrorHeading('2026-11-16', today), { today: false, text: 'Au menu' });
  // No date set, or no known "today" (static HTML, no JavaScript, no time zone).
  assert.deepEqual(mirrorHeading(undefined, today), { today: false, text: 'Au menu' });
  assert.deepEqual(mirrorHeading('2026-11-17', undefined), { today: false, text: 'Au menu' });
  assert.deepEqual(mirrorHeading('not a date', 'not a date'), { today: false, text: 'Au menu' });
});

test('the mirror’s day turns over at midnight in the bistro’s time zone, not UTC', () => {
  // 05:59 UTC on the 18th is still 11:59pm on the 17th in Chicago (UTC−6 in November)...
  assert.equal(zonedToday('America/Chicago', new Date('2026-11-18T05:59:00Z')), '2026-11-17');
  assert.equal(mirrorHeading('2026-11-17', zonedToday('America/Chicago', new Date('2026-11-18T05:59:00Z'))).today, true);
  // ...and one minute later it's the 18th, so the 17th's mirror reads "Au menu".
  assert.equal(zonedToday('America/Chicago', new Date('2026-11-18T06:00:00Z')), '2026-11-18');
  assert.equal(mirrorHeading('2026-11-17', zonedToday('America/Chicago', new Date('2026-11-18T06:00:00Z'))).today, false);
});

test('mirror dates are real calendar dates and are written in French', () => {
  assert.ok(isValidDate('2026-11-17'));
  for (const bad of ['2026-02-30', '2026-13-01', '17/11/2026', '2026-1-7', '']) assert.ok(!isValidDate(bad), bad);
  assert.equal(formatMirrorDate('2026-11-17'), 'mardi 17 novembre');
});
