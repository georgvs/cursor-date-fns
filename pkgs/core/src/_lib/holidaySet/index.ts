import { startOfDay } from "../../startOfDay/index.ts";
import { toDate } from "../../toDate/index.ts";
import type { ContextFn, DateArg } from "../../types.ts";

/**
 * Normalize consumer-provided holidays to start-of-day timestamps in `context`.
 * Invalid dates are dropped so they never match.
 */
export function holidaySet(
  holidays: Array<DateArg<Date> & {}> | undefined,
  context?: ContextFn<Date>,
): Set<number> {
  const set = new Set<number>();
  if (!holidays?.length) return set;

  for (const holiday of holidays) {
    const date = toDate(holiday, context);
    if (isNaN(+date)) continue;
    set.add(+startOfDay(date, { in: context }));
  }

  return set;
}

/**
 * True if `date` is the same calendar day as a normalized holiday.
 */
export function isHolidayDate(
  date: Date,
  holidays: Set<number>,
  context?: ContextFn<Date>,
): boolean {
  return holidays.has(+startOfDay(date, { in: context }));
}
