import { isHoliday } from "../isHoliday/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import { toDate } from "../toDate/index.ts";
import type { ContextOptions, DateArg, HolidaysOptions } from "../types.ts";

/**
 * The {@link isBusinessDay} function options.
 */
export interface IsBusinessDayOptions
  extends HolidaysOptions, ContextOptions<Date> {}

/**
 * @name isBusinessDay
 * @category Weekday Helpers
 * @summary Is the given date a business day?
 *
 * @description
 * Returns `true` if `date` is a weekday (Monday–Friday) and is not in the
 * consumer-provided `holidays` list. Dates are converted with `toDate` using
 * `options.in`.
 *
 * Weekends stay weekends even when listed as holidays. An invalid `date`
 * returns `false`.
 *
 * @param date - The date to check
 * @param options - The options object
 *
 * @returns The date is a business day
 *
 * @example
 * // Is 24 December 2020 a business day?
 * const result = isBusinessDay(new Date(2020, 11, 24))
 * //=> true
 *
 * @example
 * // Friday Christmas is not a business day when configured as a holiday:
 * const result = isBusinessDay(new Date(2020, 11, 25), {
 *   holidays: [new Date(2020, 11, 25)],
 * })
 * //=> false
 */
export function isBusinessDay(
  date: DateArg<Date> & {},
  options?: IsBusinessDayOptions | undefined,
): boolean {
  const _date = toDate(date, options?.in);
  if (isNaN(+_date)) return false;

  return !isWeekend(_date, options) && !isHoliday(_date, options);
}
