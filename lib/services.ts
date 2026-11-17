// Services (déjeuner and dîner), the "service now" status and the weekly summary.
// Pure functions with no imports, so they are unit tested directly and the browser only supplies
// the current time in the bistro's time zone.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** The two bistro services. Shown in French, as on the door. */
export type ServiceLabel = 'Déjeuner' | 'Dîner';

export const SERVICE_LABELS: readonly ServiceLabel[] = ['Déjeuner', 'Dîner'];

export interface Service {
  /** "Déjeuner" (lunch) or "Dîner" (dinner). */
  label: ServiceLabel;
  /** 24-hour "HH:MM" local time, e.g. "11:30". */
  opens: string;
  /** 24-hour "HH:MM" local time when the kitchen closes, e.g. "22:00". Later than `opens`, same day. */
  closes: string;
}

export interface DayHours {
  day: Day;
  /** Zero or more services, earliest first. An empty list means closed all day. */
  services: Service[];
}

export const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "07:30" → "7:30am", "18:00" → "6pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "11:30am – 2:30pm". */
export function formatService(service: Service): string {
  return `${formatTime(service.opens)} – ${formatTime(service.closes)}`;
}

const short = (day: Day) => day.slice(0, 3);

/** ["Tuesday", "Wednesday", "Thursday", "Saturday"] → "Tue – Thu, Sat". Days must be in week order. */
export function dayRanges(days: readonly Day[]): string {
  const runs: Day[][] = [];
  for (const day of days) {
    const last = runs.at(-1);
    if (last && DAYS.indexOf(day) === DAYS.indexOf(last.at(-1)!) + 1) last.push(day);
    else runs.push([day]);
  }
  return runs.map(run => run.length === 1 ? run[0] : run.length === 2 ? `${short(run[0])} & ${short(run[1])}` : `${short(run[0])} – ${short(run.at(-1)!)}`).join(', ');
}

export interface HoursRow {
  /** "Déjeuner" or "Dîner". */
  label: ServiceLabel;
  /** "Tue – Fri" */
  days: string;
  /** "11:30am – 2:30pm" */
  hours: string;
}

/**
 * Hours by service, e.g. Déjeuner · Tue – Fri · 11:30am – 2:30pm. Days with the same times for a
 * service are grouped; a service with different times on some days gets one row per set of times.
 */
export function hoursByService(hours: readonly DayHours[]): HoursRow[] {
  const rows: HoursRow[] = [];
  for (const label of SERVICE_LABELS) {
    const byTimes = new Map<string, Day[]>();
    for (const entry of hours) {
      for (const service of entry.services.filter(s => s.label === label)) {
        const key = formatService(service);
        byTimes.set(key, [...(byTimes.get(key) ?? []), entry.day]);
      }
    }
    for (const [times, days] of byTimes) rows.push({ label, days: dayRanges(days), hours: times });
  }
  return rows;
}

/** Days with no service at all, e.g. "Sun & Mon" (wrapping round the week end). '' when open daily. */
export function closedDays(hours: readonly DayHours[]): string {
  const closed = DAYS.filter(day => !(hours.find(entry => entry.day === day)?.services.length));
  if (!closed.length) return '';
  // Start the list after an open day so Sunday + Monday reads "Sun & Mon", not "Mon, Sun".
  const firstOpen = DAYS.findIndex(day => !closed.includes(day));
  const rotated = firstOpen < 0 ? closed : [...DAYS.slice(firstOpen), ...DAYS.slice(0, firstOpen)].filter(day => closed.includes(day));
  if (rotated.length === 2) return `${short(rotated[0])} & ${short(rotated[1])}`;
  return rotated.length === 1 ? `${rotated[0]}s` : rotated.map(short).join(', ');
}

/** The no-JavaScript summary: "Déjeuner Tue – Fri · Dîner Tue – Sat". Never claims open or closed now. */
export function servicesSummary(hours: readonly DayHours[]): string {
  return SERVICE_LABELS.map(label => {
    const days = DAYS.filter(day => hours.find(entry => entry.day === day)?.services.some(s => s.label === label));
    return days.length ? `${label} ${dayRanges(days)}` : '';
  }).filter(Boolean).join(' · ');
}

export interface NextService {
  day: Day;
  service: Service;
  /** 0 = later today, 1 = tomorrow, and so on. */
  daysAhead: number;
}

export type ServiceState =
  /** Inside a service. */
  | { status: 'serving'; service: Service }
  /** A service has run today and another starts later today. */
  | { status: 'between'; next: NextService }
  /** Before today's first service. */
  | { status: 'before'; next: NextService }
  /** Today's services are over. */
  | { status: 'after'; next?: NextService }
  /** No service today at all. */
  | { status: 'closed-today'; next?: NextService };

/** The next service that opens after `minutes` today, or on a following day (up to a week ahead). */
export function nextService(day: Day, minutes: number, hours: readonly DayHours[]): NextService | undefined {
  const start = DAYS.indexOf(day);
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    const services = hours.find(entry => entry.day === candidate)?.services ?? [];
    for (const service of services) {
      if (daysAhead === 0 && toMinutes(service.opens) <= minutes) continue;
      return { day: candidate, service, daysAhead };
    }
  }
  return undefined;
}

/** Which service, if any, is on at a local day/time. `minutes` is minutes after midnight in the bistro's zone. */
export function serviceState(day: Day, minutes: number, hours: readonly DayHours[]): ServiceState {
  const today = hours.find(entry => entry.day === day)?.services ?? [];
  const current = today.find(service => minutes >= toMinutes(service.opens) && minutes < toMinutes(service.closes));
  if (current) return { status: 'serving', service: current };
  const next = nextService(day, minutes, hours);
  if (!today.length) return { status: 'closed-today', next };
  const started = today.some(service => toMinutes(service.opens) <= minutes);
  if (!started) return { status: 'before', next: next! };
  if (next && next.daysAhead === 0) return { status: 'between', next };
  return { status: 'after', next };
}

export type ServiceTone = 'serving' | 'between' | 'closed';

function when(next: NextService): string {
  return next.daysAhead === 0 ? 'today' : next.daysAhead === 1 ? 'tomorrow' : next.day;
}

/** Words for the status, e.g. "Déjeuner · until 2:30pm" or "Closed today · déjeuner Tuesday from 11:30am". */
export function describeService(state: ServiceState): { text: string; tone: ServiceTone } {
  switch (state.status) {
    case 'serving': {
      const until = state.service.label === 'Dîner' ? 'kitchen until' : 'until';
      return { text: `${state.service.label} · ${until} ${formatTime(state.service.closes)}`, tone: 'serving' };
    }
    case 'between':
      return { text: `Between services · ${state.next.service.label.toLowerCase()} from ${formatTime(state.next.service.opens)}`, tone: 'between' };
    case 'before':
      return { text: `Opens today · ${state.next.service.label.toLowerCase()} from ${formatTime(state.next.service.opens)}`, tone: 'closed' };
    case 'after':
    case 'closed-today': {
      const lead = state.status === 'after' ? 'Closed for the night' : 'Closed today';
      if (!state.next) return { text: lead, tone: 'closed' };
      return { text: `${lead} · ${state.next.service.label.toLowerCase()} ${when(state.next)} from ${formatTime(state.next.service.opens)}`, tone: 'closed' };
    }
  }
}

/** Whether a given service (e.g. the lunch formule's "déjeuner") is being served right now. */
export function isServing(state: ServiceState, label: ServiceLabel): boolean {
  return state.status === 'serving' && state.service.label === label;
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function zonedNow(timeZone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
