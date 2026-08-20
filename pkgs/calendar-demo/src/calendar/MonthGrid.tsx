import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { PublicHoliday } from "../api/nager.ts";
import { dateKey, getDayStatus } from "./dayStatus.ts";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MonthGridProps {
  month: Date;
  holidayDates: Date[];
  holidaysByDate: Map<string, PublicHoliday[]>;
}

export function MonthGrid({
  month,
  holidayDates,
  holidaysByDate,
}: MonthGridProps) {
  const monthStart = startOfMonth(month);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  return (
    <section className="month">
      <h2>{format(month, "MMMM")}</h2>
      <div className="weekday-row" aria-hidden="true">
        {WEEKDAYS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="days">
        {days.map((day) => {
          const key = dateKey(day);
          const onDay = holidaysByDate.get(key) ?? [];
          const status = getDayStatus(day, holidayDates, onDay);
          const outside = !isSameMonth(day, monthStart);
          const className = [
            "day",
            outside ? "day-outside" : "",
            status.kind === "holiday" ? "day-holiday" : "",
            status.kind === "weekend" ? "day-weekend" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const title =
            status.holidayNames.length > 0
              ? status.holidayNames.join(", ")
              : undefined;

          return (
            <div key={key} className={className} title={title}>
              <span className="day-number">{format(day, "d")}</span>
              {!outside && status.holidayNames[0] ? (
                <span className="day-name">{status.holidayNames[0]}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
