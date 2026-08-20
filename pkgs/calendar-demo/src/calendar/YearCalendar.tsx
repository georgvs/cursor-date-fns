import { eachMonthOfInterval, endOfYear, startOfYear } from "date-fns";
import type { PublicHoliday } from "../api/nager.ts";
import { MonthGrid } from "./MonthGrid.tsx";

interface YearCalendarProps {
  year: number;
  holidayDates: Date[];
  holidaysByDate: Map<string, PublicHoliday[]>;
}

export function YearCalendar({
  year,
  holidayDates,
  holidaysByDate,
}: YearCalendarProps) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });

  return (
    <div className="year-grid" key={year}>
      {months.map((month) => (
        <MonthGrid
          key={month.toISOString()}
          month={month}
          holidayDates={holidayDates}
          holidaysByDate={holidaysByDate}
        />
      ))}
    </div>
  );
}
