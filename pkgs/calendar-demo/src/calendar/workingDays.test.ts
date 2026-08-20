import { describe, expect, it } from "vitest";
import {
  countWorkingDaysInYear,
  dateKey,
  workingDaysSince,
} from "./workingDays.ts";

describe("countWorkingDaysInYear", () => {
  it("does not count weekday holidays as working days", () => {
    // 2026-01-01 is Thursday
    const withoutHolidays = countWorkingDaysInYear(2026, []);
    const withNewYear = countWorkingDaysInYear(2026, [new Date(2026, 0, 1)]);
    expect(withNewYear).toBe(withoutHolidays - 1);
  });

  it("does not double-subtract weekend holidays", () => {
    // 2026-01-03 is Saturday
    const withoutHolidays = countWorkingDaysInYear(2026, []);
    const withWeekendHoliday = countWorkingDaysInYear(2026, [
      new Date(2026, 0, 3),
    ]);
    expect(withWeekendHoliday).toBe(withoutHolidays);
  });
});

describe("workingDaysSince", () => {
  it("skips weekends when collecting working days", () => {
    // Friday 2026-01-02 → next 2 working days are Mon 5 and Tue 6
    const days = workingDaysSince(new Date(2026, 0, 2), 2, []);
    expect(days.map(dateKey)).toEqual(["2026-01-05", "2026-01-06"]);
  });

  it("skips holidays that fall on weekdays", () => {
    // Thu 2026-01-01 holiday, Fri 2026-01-02 holiday (BG-style)
    // From Wed 2025-12-31, 2 working days skip those holidays → Mon 5, Tue 6
    const holidays = [new Date(2026, 0, 1), new Date(2026, 0, 2)];
    const days = workingDaysSince(new Date(2025, 11, 31), 2, holidays);
    expect(days.map(dateKey)).toEqual(["2026-01-05", "2026-01-06"]);
  });

  it("matches addBusinessDays end date for amount 5 with holidays", async () => {
    const { addBusinessDays } = await import("date-fns");
    const start = new Date(2026, 2, 2); // Monday
    const holidays = [new Date(2026, 2, 3)]; // Tuesday holiday
    const days = workingDaysSince(start, 5, holidays);
    expect(days).toHaveLength(5);
    expect(days[days.length - 1]).toEqual(
      addBusinessDays(start, 5, { holidays }),
    );
    expect(days.map(dateKey)).not.toContain("2026-03-03");
  });
});
