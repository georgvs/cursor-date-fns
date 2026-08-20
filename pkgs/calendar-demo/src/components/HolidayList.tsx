import { format, parseISO } from "date-fns";
import type { PublicHoliday } from "../api/nager.ts";
import { holidayDisplayName } from "../api/nager.ts";

interface HolidayListProps {
  countryCode: string;
  year: number;
  holidays: PublicHoliday[];
}

export function HolidayList({ countryCode, year, holidays }: HolidayListProps) {
  return (
    <aside className="holiday-panel">
      <h2>Holidays</h2>
      <p className="meta">
        <code>{countryCode}</code> · {year} · {holidays.length} listed
      </p>
      {holidays.length === 0 ? (
        <p className="holiday-empty">No holidays returned for this selection.</p>
      ) : (
        <ul className="holiday-list">
          {holidays.map((holiday) => (
            <li key={`${countryCode}-${holiday.date}-${holiday.name}`}>
              <span className="holiday-date">
                {format(parseISO(holiday.date), "MMM d")}
              </span>
              <span className="holiday-name">{holidayDisplayName(holiday)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
