import {
  addDays,
  eachDayOfInterval,
  endOfYear,
  format,
  isBusinessDay,
  startOfDay,
  startOfYear,
} from "date-fns";

export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Count weekdays in `year` that are not in `holidays`.
 */
export function countWorkingDaysInYear(year: number, holidays: Date[]): number {
  const days = eachDayOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });

  let count = 0;
  for (const day of days) {
    if (isBusinessDay(day, { holidays })) count += 1;
  }
  return count;
}

/**
 * Walk forward from `start` (exclusive) and collect the next `amount`
 * business days, skipping weekends and holidays — same rules as
 * `addBusinessDays`.
 */
export function workingDaysSince(
  start: Date,
  amount: number,
  holidays: Date[],
): Date[] {
  if (!Number.isFinite(amount) || amount <= 0) return [];

  const collected: Date[] = [];
  let cursor = startOfDay(start);

  while (collected.length < amount) {
    cursor = addDays(cursor, 1);
    if (isBusinessDay(cursor, { holidays })) {
      collected.push(cursor);
    }
  }

  return collected;
}
