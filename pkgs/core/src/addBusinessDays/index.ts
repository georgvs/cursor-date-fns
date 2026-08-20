import { holidaySet, isHolidayDate } from "../_lib/holidaySet/index.ts";
import { constructFrom } from "../constructFrom/index.ts";
import { isSaturday } from "../isSaturday/index.ts";
import { isSunday } from "../isSunday/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import { toDate } from "../toDate/index.ts";
import type { ContextOptions, DateArg, HolidaysOptions } from "../types.ts";

/**
 * The {@link addBusinessDays} function options.
 */
export interface AddBusinessDaysOptions<DateType extends Date = Date>
  extends ContextOptions<DateType>, HolidaysOptions {}

/**
 * @name addBusinessDays
 * @category Day Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date, ignoring weekends.
 * Pass `holidays` to also skip those calendar days when they fall on a weekday.
 *
 * **You don't need date-fns\***:
 *
 * Temporal doesn't have built-in business day arithmetic, so you still need date-fns for this.
 *
 * \* **Not really**, see: https://date-fns.org/you-dont-need-date-fns
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be added.
 * @param options - An object with options
 *
 * @returns The new date with the business days added
 *
 * @example
 * // Add 10 business days to 1 September 2014:
 * const result = addBusinessDays(new Date(2014, 8, 1), 10)
 * //=> Mon Sep 15 2014 00:00:00 (skipped weekend days)
 *
 * @example
 * // Add 1 business day to 24 December 2020, skipping Christmas:
 * const result = addBusinessDays(new Date(2020, 11, 24), 1, {
 *   holidays: [new Date(2020, 11, 25)],
 * })
 * //=> Mon Dec 28 2020 00:00:00
 */
export function addBusinessDays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: AddBusinessDaysOptions<ResultDate> | undefined,
): ResultDate {
  const _date = toDate(date, options?.in);

  if (isNaN(amount)) return constructFrom(options?.in, NaN);

  const holidays = holidaySet(options?.holidays, options?.in);
  const startedOnWeekend = isWeekend(_date, options);
  const hours = _date.getHours();
  const sign = amount < 0 ? -1 : 1;

  if (holidays.size) {
    let restDays = Math.abs(amount);
    while (restDays > 0) {
      _date.setDate(_date.getDate() + sign);
      if (isWorkingDay(_date, holidays, options)) restDays -= 1;
    }
  } else {
    const fullWeeks = Math.trunc(amount / 5);

    _date.setDate(_date.getDate() + fullWeeks * 7);

    // Get remaining days not part of a full week
    let restDays = Math.abs(amount % 5);

    // Loops over remaining days
    while (restDays > 0) {
      _date.setDate(_date.getDate() + sign);
      if (!isWeekend(_date, options)) restDays -= 1;
    }

    // If the date is a weekend day and we reduce a dividable of
    // 5 from it, we land on a weekend date.
    // To counter this, we add days accordingly to land on the next business day
    if (startedOnWeekend && isWeekend(_date, options) && amount !== 0) {
      // If we're reducing days, we want to add days until we land on a weekday
      // If we're adding days we want to reduce days until we land on a weekday
      if (isSaturday(_date, options))
        _date.setDate(_date.getDate() + (sign < 0 ? 2 : -1));
      if (isSunday(_date, options))
        _date.setDate(_date.getDate() + (sign < 0 ? 1 : -2));
    }
  }

  // Restore hours to avoid DST lag
  _date.setHours(hours);

  return _date;
}

function isWorkingDay<ResultDate extends Date>(
  date: ResultDate,
  holidays: Set<number>,
  options?: AddBusinessDaysOptions<ResultDate>,
): boolean {
  return (
    !isWeekend(date, options) && !isHolidayDate(date, holidays, options?.in)
  );
}
