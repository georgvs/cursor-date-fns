import { holidaySet, isHolidayDate } from "../_lib/holidaySet/index.ts";
import { toDate } from "../toDate/index.ts";
import type { ContextOptions, DateArg, HolidaysOptions } from "../types.ts";

/**
 * The {@link isHoliday} function options.
 */
export interface IsHolidayOptions
  extends HolidaysOptions, ContextOptions<Date> {}

/**
 * @name isHoliday
 * @category Day Helpers
 * @summary Is the given date a configured holiday?
 *
 * @description
 * Returns `true` if `date` is the same calendar day as any date in the
 * consumer-provided `holidays` list. Dates are converted with `toDate` and
 * compared by start of day in `options.in`.
 *
 * Missing, empty, or invalid `holidays` never match. An invalid `date`
 * returns `false`.
 *
 * This does not change weekend helpers: a Saturday holiday is still a Saturday.
 *
 * @param date - The date to check
 * @param options - The options object
 *
 * @returns The date is a configured holiday
 *
 * @example
 * // Is 25 December 2020 a configured holiday?
 * const result = isHoliday(new Date(2020, 11, 25), {
 *   holidays: [new Date(2020, 11, 25)],
 * })
 * //=> true
 *
 * @example
 * // Without a holidays list, nothing is a holiday:
 * const result = isHoliday(new Date(2020, 11, 25))
 * //=> false
 */
export function isHoliday(
  date: DateArg<Date> & {},
  options?: IsHolidayOptions | undefined,
): boolean {
  const _date = toDate(date, options?.in);
  if (isNaN(+_date)) return false;

  const holidays = holidaySet(options?.holidays, options?.in);
  if (!holidays.size) return false;

  return isHolidayDate(_date, holidays, options?.in);
}
