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
  selectedKey: string | null;
  projectedKeys: Set<string>;
  onSelectDay: (day: Date) => void;
}

export function MonthGrid({
  month,
  holidayDates,
  holidaysByDate,
  selectedKey,
  projectedKeys,
  onSelectDay,
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
          const selected = selectedKey === key;
          const projected = projectedKeys.has(key);
          const className = [
            "day",
            outside ? "day-outside" : "",
            status.kind === "holiday" ? "day-holiday" : "",
            status.kind === "weekend" ? "day-weekend" : "",
            selected ? "day-selected" : "",
            projected ? "day-projected" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const titleParts = [
            status.holidayNames.length > 0
              ? status.holidayNames.join(", ")
              : null,
            selected ? "Selected start" : null,
            projected ? "Counted working day" : null,
          ].filter(Boolean);

          return (
            <button
              type="button"
              key={key}
              className={className}
              title={titleParts.join(" · ") || undefined}
              disabled={outside}
              onClick={() => onSelectDay(day)}
            >
              <span className="day-number">{format(day, "d")}</span>
              {!outside && status.holidayNames[0] ? (
                <span className="day-name">{status.holidayNames[0]}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
