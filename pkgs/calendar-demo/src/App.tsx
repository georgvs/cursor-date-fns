import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  fetchAvailableCountries,
  fetchPublicHolidays,
  holidaysByDate,
  toHolidayDates,
  type Country,
  type PublicHoliday,
} from "./api/nager.ts";
import { dateKey } from "./calendar/dayStatus.ts";
import { YearCalendar } from "./calendar/YearCalendar.tsx";
import {
  countWorkingDaysInYear,
  workingDaysSince,
} from "./calendar/workingDays.ts";
import { CountrySelect } from "./components/CountrySelect.tsx";
import { HolidayList } from "./components/HolidayList.tsx";
import { WorkingDaysCounter } from "./components/WorkingDaysCounter.tsx";
import { YearSelect } from "./components/YearSelect.tsx";

const DEFAULT_COUNTRY = "BG";
const DEFAULT_YEAR = 2026;
const DEFAULT_WORKING_DAY_COUNTER = 5;

function yearOptions(center: number): number[] {
  const years: number[] = [];
  for (let year = center - 5; year <= center + 5; year += 1) {
    years.push(year);
  }
  return years;
}

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [holidaysError, setHolidaysError] = useState<string | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [workingDayCounter, setWorkingDayCounter] = useState(
    DEFAULT_WORKING_DAY_COUNTER,
  );
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);

  const years = useMemo(() => yearOptions(DEFAULT_YEAR), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCountries(true);
    setCountriesError(null);

    fetchAvailableCountries(controller.signal)
      .then((list) => {
        setCountries(list);
        if (!list.some((country) => country.countryCode === countryCode)) {
          const fallback =
            list.find((country) => country.countryCode === DEFAULT_COUNTRY) ??
            list[0];
          if (fallback) setCountryCode(fallback.countryCode);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setCountriesError(
          error instanceof Error ? error.message : "Failed to load countries",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCountries(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoadingHolidays(true);
    setHolidaysError(null);
    setHolidays([]);
    setSelectedStart(null);

    fetchPublicHolidays(year, countryCode, controller.signal)
      .then((list) => {
        if (!active || controller.signal.aborted) return;
        setHolidays(list);
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setHolidays([]);
        setHolidaysError(
          error instanceof Error ? error.message : "Failed to load holidays",
        );
      })
      .finally(() => {
        if (!active || controller.signal.aborted) return;
        setLoadingHolidays(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [countryCode, year]);

  const holidayDates = useMemo(() => toHolidayDates(holidays), [holidays]);
  const byDate = useMemo(() => holidaysByDate(holidays), [holidays]);

  const workingDaysInYear = useMemo(
    () => countWorkingDaysInYear(year, holidayDates),
    [year, holidayDates],
  );

  const projectedDays = useMemo(() => {
    if (!selectedStart) return [];
    return workingDaysSince(selectedStart, workingDayCounter, holidayDates);
  }, [selectedStart, workingDayCounter, holidayDates]);

  const projectedKeys = useMemo(
    () => new Set(projectedDays.map(dateKey)),
    [projectedDays],
  );

  const selectedKey = selectedStart ? dateKey(selectedStart) : null;
  const projectionEnd = projectedDays[projectedDays.length - 1] ?? null;

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">date-fns · isHoliday · isBusinessDay</p>
        <h1>Holiday Calendar</h1>
        <p>
          Pick a country and year to load public holidays from Nager.Date. Set a
          working-day counter, then click a date to visualize that many working
          days ahead — weekends and holidays are skipped.
        </p>
      </header>

      <div className="controls">
        <CountrySelect
          countries={countries}
          value={countryCode}
          onChange={setCountryCode}
          disabled={loadingCountries && countries.length === 0}
        />
        <YearSelect value={year} years={years} onChange={setYear} />
        <WorkingDaysCounter
          value={workingDayCounter}
          onChange={setWorkingDayCounter}
        />
      </div>

      <div className="legend" aria-label="Calendar legend">
        <span className="legend-item">
          <span className="swatch swatch-weekend" /> Weekend
        </span>
        <span className="legend-item">
          <span className="swatch swatch-holiday" /> Holiday
        </span>
        <span className="legend-item">
          <span className="swatch swatch-selected" /> Start
        </span>
        <span className="legend-item">
          <span className="swatch swatch-projected" /> Counted working day
        </span>
        <span className="legend-item">Week starts Sunday</span>
      </div>

      {countriesError ? (
        <p className="status status-error">{countriesError}</p>
      ) : null}
      {holidaysError ? (
        <p className="status status-error">{holidaysError}</p>
      ) : null}
      {loadingHolidays ? (
        <p className="status">Loading holidays…</p>
      ) : (
        <p className="status">
          Showing {holidays.length} holidays for {countryCode} in {year}.{" "}
          <strong>{workingDaysInYear}</strong> working days in {year} (weekends
          and holidays excluded).
        </p>
      )}

      {selectedStart && projectionEnd ? (
        <p className="status projection-status">
          From <strong>{format(selectedStart, "MMM d, yyyy")}</strong>,{" "}
          {workingDayCounter} working day
          {workingDayCounter === 1 ? "" : "s"} ahead lands on{" "}
          <strong>{format(projectionEnd, "MMM d, yyyy")}</strong>. Highlighted
          days skip weekends and holidays.
        </p>
      ) : (
        <p className="status projection-hint">
          Click a calendar day to count {workingDayCounter} working day
          {workingDayCounter === 1 ? "" : "s"} from that date.
        </p>
      )}

      <div className="layout">
        <YearCalendar
          year={year}
          holidayDates={holidayDates}
          holidaysByDate={byDate}
          resetKey={`${countryCode}-${year}-${holidays.length}`}
          selectedKey={selectedKey}
          projectedKeys={projectedKeys}
          onSelectDay={setSelectedStart}
        />
        <HolidayList
          key={`${countryCode}-${year}`}
          countryCode={countryCode}
          year={year}
          holidays={holidays}
        />
      </div>

      <p className="footnote">
        Holiday data via{" "}
        <a href="https://date.nager.at/" target="_blank" rel="noreferrer">
          Nager.Date
        </a>
        . Working-day math via date-fns <code>isBusinessDay</code> /{" "}
        <code>addBusinessDays</code>.
      </p>
    </div>
  );
}
