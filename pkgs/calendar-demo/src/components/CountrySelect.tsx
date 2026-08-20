import type { Country } from "../api/nager.ts";

interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (countryCode: string) => void;
  disabled?: boolean;
}

export function CountrySelect({
  countries,
  value,
  onChange,
  disabled,
}: CountrySelectProps) {
  return (
    <div className="field">
      <label htmlFor="country">Country</label>
      <select
        id="country"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {countries.length === 0 ? <option value={value}>{value}</option> : null}
        {countries.map((country) => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.countryCode} — {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
