import { format, isHoliday, isWeekend } from "date-fns";
import type { PublicHoliday } from "../api/nager.ts";
import { holidayDisplayName } from "../api/nager.ts";

export type DayKind = "weekday" | "weekend" | "holiday";

export interface DayStatus {
  kind: DayKind;
  holidayNames: string[];
}

/**
 * Classify a calendar day. Holidays take precedence over weekends.
 * Uses date-fns `isHoliday` / `isWeekend` with the consumer holiday list.
 */
export function getDayStatus(
  date: Date,
  holidayDates: Date[],
  holidaysOnDay: PublicHoliday[] = [],
): DayStatus {
  const holidayNames = holidaysOnDay.map(holidayDisplayName);

  if (
    isHoliday(date, { holidays: holidayDates }) ||
    holidaysOnDay.length > 0
  ) {
    return { kind: "holiday", holidayNames };
  }

  if (isWeekend(date)) {
    return { kind: "weekend", holidayNames: [] };
  }

  return { kind: "weekday", holidayNames: [] };
}

export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
