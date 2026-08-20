import { tpIsHoliday } from "../isHoliday/index.ts";
import { tpIsWeekend } from "../isWeekend/index.ts";
import type { ContextOptions, DateArg } from "../../types.ts";

export function tpIsBusinessDay(
  date: Temporal.ZonedDateTime,
  holidays: Array<DateArg<Date> & {}> | undefined,
  options?: ContextOptions<Date>,
): boolean {
  return !tpIsWeekend(date) && !tpIsHoliday(date, holidays, options);
}
