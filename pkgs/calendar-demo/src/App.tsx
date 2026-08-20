import { useEffect, useMemo, useState } from "react";
import {
  fetchAvailableCountries,
  fetchPublicHolidays,
  holidaysByDate,
  toHolidayDates,
  type Country,
  type PublicHoliday,
} from "./api/nager.ts";
import { YearCalendar } from "./calendar/YearCalendar.tsx";
import { CountrySelect } from "./components/CountrySelect.tsx";
import { HolidayList } from "./components/HolidayList.tsx";
import { YearSelect } from "./components/YearSelect.tsx";

const DEFAULT_COUNTRY = "BG";
const DEFAULT_YEAR = 2026;

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

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">date-fns · isHoliday</p>
        <h1>Holiday Calendar</h1>
        <p>
          Pick a country and year to load public holidays from Nager.Date, then
          highlight them with date-fns <code>isHoliday</code> and{" "}
          <code>isWeekend</code>. Holidays win when they fall on a weekend.
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
      </div>

      <div className="legend" aria-label="Calendar legend">
        <span className="legend-item">
          <span className="swatch swatch-weekend" /> Weekend
        </span>
        <span className="legend-item">
          <span className="swatch swatch-holiday" /> Holiday
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
          Showing {holidays.length} holidays for {countryCode} in {year}.
        </p>
      )}

      <div className="layout">
        <YearCalendar
          year={year}
          holidayDates={holidayDates}
          holidaysByDate={byDate}
          resetKey={`${countryCode}-${year}-${holidays.length}`}
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
        . Day classification via date-fns.
      </p>
    </div>
  );
}
