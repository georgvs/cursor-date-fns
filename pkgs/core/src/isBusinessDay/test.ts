import { tz } from "@date-fns/tz";
import { describe, expect, it } from "vitest";
import { isSaturday } from "../isSaturday/index.ts";
import { isSunday } from "../isSunday/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";
import { isBusinessDay } from "./index.ts";

describe("isBusinessDay", () => {
  it("returns true if the given date is a weekday", () => {
    const result = isBusinessDay(new Date(2020, 11 /* Dec */, 24));
    expect(result).toBe(true);
  });

  it("returns false if the given date is a weekend", () => {
    expect(isBusinessDay(new Date(2020, 11 /* Dec */, 26))).toBe(false);
    expect(isBusinessDay(new Date(2020, 11 /* Dec */, 27))).toBe(false);
  });

  it("returns false if the given weekday is a configured holiday", () => {
    const result = isBusinessDay(new Date(2020, 11 /* Dec */, 25), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(false);
  });

  it("returns true if a weekday is not in the holidays list", () => {
    const result = isBusinessDay(new Date(2020, 11 /* Dec */, 24), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(true);
  });

  it("accepts a timestamp", () => {
    const result = isBusinessDay(new Date(2020, 11 /* Dec */, 24).getTime());
    expect(result).toBe(true);
  });

  it("returns false if the given date is `Invalid Date`", () => {
    const result = isBusinessDay(new Date(NaN), {
      holidays: [new Date(2020, 11 /* Dec */, 25)],
    });
    expect(result).toBe(false);
  });

  it("ignores invalid entries in holidays", () => {
    const result = isBusinessDay(new Date(2020, 11 /* Dec */, 24), {
      holidays: [new Date(NaN)],
    });
    expect(result).toBe(true);
  });

  it("keeps weekend helpers weekday-only when the date is also a holiday", () => {
    const saturday = new Date(2020, 11 /* Dec */, 26);
    const holidays = [saturday];

    expect(isBusinessDay(saturday, { holidays })).toBe(false);
    expect(isSaturday(saturday)).toBe(true);
    expect(isSunday(saturday)).toBe(false);
    expect(isWeekend(saturday)).toBe(true);
  });

  it("returns false for a weekday leap day holiday", () => {
    const leapDay = new Date(2016, 1 /* Feb */, 29);
    expect(isBusinessDay(leapDay)).toBe(true);
    expect(isBusinessDay(leapDay, { holidays: [leapDay] })).toBe(false);
  });

  describe("context", () => {
    it("allows to specify the context", () => {
      expect(
        isBusinessDay("2020-12-25T05:00:00Z", {
          in: tz("America/New_York"),
        }),
      ).toBe(true);
      expect(
        isBusinessDay("2020-12-25T04:00:00Z", {
          in: tz("America/New_York"),
        }),
      ).toBe(true);
    });

    it("uses the context when matching holidays", () => {
      expect(
        isBusinessDay("2020-12-25T05:00:00Z", {
          holidays: ["2020-12-25T10:00:00Z"],
          in: tz("America/New_York"),
        }),
      ).toBe(false);
      expect(
        isBusinessDay("2020-12-25T04:00:00Z", {
          holidays: ["2020-12-25T10:00:00Z"],
          in: tz("America/New_York"),
        }),
      ).toBe(true);
    });

    it("doesn't enforce argument and context to be of the same type", () => {
      function _test<DateType extends Date, ResultDate extends Date = DateType>(
        arg: DateArg<DateType>,
        options?: ContextOptions<ResultDate>,
      ) {
        isBusinessDay(arg, { in: options?.in });
      }
    });
  });
});
