interface YearSelectProps {
  value: number;
  years: number[];
  onChange: (year: number) => void;
}

export function YearSelect({ value, years, onChange }: YearSelectProps) {
  return (
    <div className="field">
      <label htmlFor="year">Year</label>
      <select
        id="year"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
