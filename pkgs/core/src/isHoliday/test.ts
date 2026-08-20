import { tz } from "@date-fns/tz";
import { describe, expect, it } from "vitest";
import { isSaturday } from "../isSaturday/index.ts";
import { isSunday } from "../isSunday/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";
import { isHoliday } from "./index.ts";

describe("isHoliday", () => {
  it("returns true if the given date is in the holidays list", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 25), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(true);
  });

  it("returns false if the given date is not in the holidays list", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 24), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(false);
  });

  it("returns false when holidays are omitted", () => {
    expect(isHoliday(new Date(2020, 11 /* Dec */, 25))).toBe(false);
  });

  it("returns false when holidays are empty", () => {
    expect(isHoliday(new Date(2020, 11 /* Dec */, 25), { holidays: [] })).toBe(
      false,
    );
  });

  it("matches by calendar day, ignoring time of day", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 25, 18, 30), {
      holidays: [new Date(2020, 11 /* Dec */, 25, 6, 0)],
    });
    expect(result).toBe(true);
  });

  it("accepts a timestamp", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 25).getTime(), {
      holidays: [new Date(2020, 11 /* Dec */, 25).getTime()],
    });
    expect(result).toBe(true);
  });

  it("accepts a date string as a holiday DateArg", () => {
    const result = isHoliday("2020-12-25T12:00:00", {
      holidays: ["2020-12-25T00:00:00"],
    });
    expect(result).toBe(true);
  });

  it("returns false if the given date is `Invalid Date`", () => {
    const result = isHoliday(new Date(NaN), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(false);
  });

  it("ignores invalid entries in holidays", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 25), {
      holidays: [new Date(NaN), new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(true);
  });

  it("does not match when holidays contains only invalid dates", () => {
    const result = isHoliday(new Date(2020, 11 /* Dec */, 25), {
      holidays: [new Date(NaN)],
    });
    expect(result).toBe(false);
  });

  it("treats a Saturday holiday as a holiday without changing weekend helpers", () => {
    const saturday = new Date(2020, 11 /* Dec */, 26);
    const holidays = [saturday];

    expect(isHoliday(saturday, { holidays })).toBe(true);
    expect(isSaturday(saturday)).toBe(true);
    expect(isWeekend(saturday)).toBe(true);
    expect(isSunday(saturday)).toBe(false);
  });

  it("matches a leap day holiday", () => {
    const leapDay = new Date(2016, 1 /* Feb */, 29);
    expect(isHoliday(leapDay, { holidays: [leapDay] })).toBe(true);
    expect(
      isHoliday(new Date(2016, 1 /* Feb */, 28), { holidays: [leapDay] }),
    ).toBe(false);
    expect(
      isHoliday(new Date(2016, 2 /* Mar */, 1), { holidays: [leapDay] }),
    ).toBe(false);
  });

  it("treats a Saturday leap day as a holiday without changing weekend helpers", () => {
    const leapSaturday = new Date(2020, 1 /* Feb */, 29);
    const holidays = [leapSaturday];

    expect(isHoliday(leapSaturday, { holidays })).toBe(true);
    expect(isSaturday(leapSaturday)).toBe(true);
    expect(isWeekend(leapSaturday)).toBe(true);
    expect(isSunday(leapSaturday)).toBe(false);
  });

  describe("context", () => {
    it("allows to specify the context", () => {
      expect(
        isHoliday("2020-12-25T05:00:00Z", {
          holidays: ["2020-12-25T10:00:00Z"],
          in: tz("America/New_York"),
        }),
      ).toBe(true);
      expect(
        isHoliday("2020-12-25T04:00:00Z", {
          holidays: ["2020-12-25T10:00:00Z"],
          in: tz("America/New_York"),
        }),
      ).toBe(false);
    });

    it("doesn't enforce argument and context to be of the same type", () => {
      function _test<DateType extends Date, ResultDate extends Date = DateType>(
        arg: DateArg<DateType>,
        options?: ContextOptions<ResultDate>,
      ) {
        isHoliday(arg, { in: options?.in, holidays: [arg] });
      }
    });
  });
});
