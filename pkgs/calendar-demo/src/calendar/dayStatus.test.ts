import { describe, expect, it } from "vitest";
import { getDayStatus } from "./dayStatus.ts";

describe("getDayStatus", () => {
  it("marks a normal weekday", () => {
    // Wednesday
    const date = new Date(2026, 0, 7);
    expect(getDayStatus(date, [])).toEqual({
      kind: "weekday",
      holidayNames: [],
    });
  });

  it("marks a weekend", () => {
    // Saturday
    const date = new Date(2026, 0, 3);
    expect(getDayStatus(date, [])).toEqual({
      kind: "weekend",
      holidayNames: [],
    });
  });

  it("marks a weekday holiday", () => {
    // Thursday New Year's Day 2026? Jan 1 2026 is Thursday
    const date = new Date(2026, 0, 1);
    const holidays = [new Date(2026, 0, 1)];
    expect(
      getDayStatus(date, holidays, [
        {
          date: "2026-01-01",
          localName: "Нова година",
          name: "New Year's Day",
          countryCode: "BG",
          fixed: true,
          global: true,
          counties: null,
          launchYear: null,
          types: ["Public"],
        },
      ]),
    ).toEqual({
      kind: "holiday",
      holidayNames: ["Нова година"],
    });
  });

  it("gives holiday precedence over weekend", () => {
    // Sunday
    const date = new Date(2026, 2, 1);
    const holidays = [new Date(2026, 2, 1)];
    const status = getDayStatus(date, holidays, [
      {
        date: "2026-03-01",
        localName: "Weekend Holiday",
        name: "Weekend Holiday",
        countryCode: "BG",
        fixed: false,
        global: true,
        counties: null,
        launchYear: null,
        types: ["Public"],
      },
    ]);
    expect(status.kind).toBe("holiday");
    expect(status.holidayNames).toEqual(["Weekend Holiday"]);
  });
});
