import { toTpInstant } from "../../_lib/tp/index.ts";
import type { ContextOptions, DateArg } from "../../types.ts";

export function tpIsHoliday(
  date: Temporal.ZonedDateTime,
  holidays: Array<DateArg<Date> & {}> | undefined,
  options?: ContextOptions<Date>,
): boolean {
  if (!holidays?.length) return false;

  for (const holiday of holidays) {
    const [temporal] = toTpInstant(holiday, options);
    if (!temporal) continue;
    if (
      temporal.year === date.year &&
      temporal.month === date.month &&
      temporal.day === date.day
    ) {
      return true;
    }
  }

  return false;
}
