import { holidaySet } from "../_lib/holidaySet/index.ts";
import { normalizeDates } from "../_lib/normalizeDates/index.ts";
import { addDays } from "../addDays/index.ts";
import { constructFrom } from "../constructFrom/index.ts";
import { differenceInCalendarDays } from "../differenceInCalendarDays/index.ts";
import { isSameDay } from "../isSameDay/index.ts";
import { isValid } from "../isValid/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import { startOfDay } from "../startOfDay/index.ts";
import type { ContextOptions, DateArg, HolidaysOptions } from "../types.ts";

/**
 * The {@link differenceInBusinessDays} function options.
 */
export interface DifferenceInBusinessDaysOptions
  extends ContextOptions<Date>, HolidaysOptions {}

/**
 * @name differenceInBusinessDays
 * @category Day Helpers
 * @summary Get the number of business days between the given dates.
 *
 * @description
 * Get the number of business day periods between the given dates.
 * Business days being days that aren't in the weekend.
 * Pass `holidays` to also exclude those calendar days when they fall on a weekday.
 * Like `differenceInCalendarDays`, the function removes the times from
 * the dates before calculating the difference.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of business days
 *
 * @example
 * // How many business days are between
 * // 10 January 2014 and 20 July 2014?
 * const result = differenceInBusinessDays(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 0, 10)
 * )
 * //=> 136
 *
 * // How many business days are between
 * // 30 November 2021 and 1 November 2021?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 30),
 *   new Date(2021, 10, 1)
 * )
 * //=> 21
 *
 * // How many business days are between
 * // 1 November 2021 and 1 December 2021?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 1),
 *   new Date(2021, 11, 1)
 * )
 * //=> -22
 *
 * // How many business days are between
 * // 1 November 2021 and 1 November 2021 ?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 1),
 *   new Date(2021, 10, 1)
 * )
 * //=> 0
 *
 * @example
 * // How many business days are between 24 and 28 December 2020,
 * // skipping Christmas?
 * const result = differenceInBusinessDays(
 *   new Date(2020, 11, 28),
 *   new Date(2020, 11, 24),
 *   { holidays: [new Date(2020, 11, 25)] }
 * )
 * //=> 1
 */
export function differenceInBusinessDays(
  laterDate: DateArg<Date> & {},
  earlierDate: DateArg<Date> & {},
  options?: DifferenceInBusinessDaysOptions | undefined,
): number {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate,
  );

  if (!isValid(laterDate_) || !isValid(earlierDate_)) return NaN;

  const diff = differenceInCalendarDays(laterDate_, earlierDate_);
  const sign = diff < 0 ? -1 : 1;
  const weeks = Math.trunc(diff / 7);

  let result = weeks * 5;
  let movingDate = addDays(earlierDate_, weeks * 7);

  // the loop below will run at most 6 times to account for the remaining days that don't makeup a full week
  while (!isSameDay(laterDate_, movingDate)) {
    // sign is used to account for both negative and positive differences
    result += isWeekend(movingDate, options) ? 0 : sign;
    movingDate = addDays(movingDate, sign);
  }

  const holidays = holidaySet(options?.holidays, options?.in);
  if (holidays.size) {
    const laterStart = +startOfDay(laterDate_, options);
    const earlierStart = +startOfDay(earlierDate_, options);
    for (const holiday of holidays) {
      if (isWeekend(constructFrom(laterDate_, holiday), options)) continue;
      const inRange =
        sign > 0
          ? holiday >= earlierStart && holiday < laterStart
          : holiday > laterStart && holiday <= earlierStart;
      if (inRange) result -= sign;
    }
  }

  // Prevent negative zero
  return result === 0 ? 0 : result;
}
