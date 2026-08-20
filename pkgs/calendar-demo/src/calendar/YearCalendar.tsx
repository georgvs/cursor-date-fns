import { eachMonthOfInterval, endOfYear, startOfYear } from "date-fns";
import type { PublicHoliday } from "../api/nager.ts";
import { MonthGrid } from "./MonthGrid.tsx";

interface YearCalendarProps {
  year: number;
  holidayDates: Date[];
  holidaysByDate: Map<string, PublicHoliday[]>;
  resetKey: string;
}

export function YearCalendar({
  year,
  holidayDates,
  holidaysByDate,
  resetKey,
}: YearCalendarProps) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });

  return (
    <div className="year-grid" key={resetKey}>
      {months.map((month) => (
        <MonthGrid
          key={`${resetKey}-${month.getMonth()}`}
          month={month}
          holidayDates={holidayDates}
          holidaysByDate={holidaysByDate}
        />
      ))}
    </div>
  );
}
