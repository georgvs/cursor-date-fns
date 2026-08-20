const NAGER_BASE = "https://date.nager.at/api/v3";

export interface Country {
  countryCode: string;
  name: string;
}

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export function holidayDisplayName(holiday: PublicHoliday): string {
  return holiday.localName || holiday.name;
}

export async function fetchAvailableCountries(
  signal?: AbortSignal,
): Promise<Country[]> {
  const response = await fetch(`${NAGER_BASE}/AvailableCountries`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to load countries (${response.status})`);
  }
  const countries = (await response.json()) as Country[];
  return countries.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchPublicHolidays(
  year: number,
  countryCode: string,
  signal?: AbortSignal,
): Promise<PublicHoliday[]> {
  const response = await fetch(
    `${NAGER_BASE}/PublicHolidays/${year}/${encodeURIComponent(countryCode)}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Failed to load holidays (${response.status})`);
  }
  return (await response.json()) as PublicHoliday[];
}

/** Group holidays by yyyy-MM-dd for calendar lookup. */
export function holidaysByDate(
  holidays: PublicHoliday[],
): Map<string, PublicHoliday[]> {
  const map = new Map<string, PublicHoliday[]>();
  for (const holiday of holidays) {
    const list = map.get(holiday.date) ?? [];
    list.push(holiday);
    map.set(holiday.date, list);
  }
  return map;
}

/** date-fns `holidays` option values from Nager dates. */
export function toHolidayDates(holidays: PublicHoliday[]): Date[] {
  return holidays.map((holiday) => {
    const [year, month, day] = holiday.date.split("-").map(Number);
    return new Date(year, month - 1, day);
  });
}
