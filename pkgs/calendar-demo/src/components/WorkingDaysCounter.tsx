interface WorkingDaysCounterProps {
  value: number;
  onChange: (value: number) => void;
}

export function WorkingDaysCounter({
  value,
  onChange,
}: WorkingDaysCounterProps) {
  return (
    <div className="field field-narrow">
      <label htmlFor="working-day-counter">Working days ahead</label>
      <input
        id="working-day-counter"
        type="number"
        min={1}
        max={60}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          onChange(Math.min(60, Math.max(1, Math.trunc(next))));
        }}
      />
    </div>
  );
}
