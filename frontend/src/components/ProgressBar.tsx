export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={label ?? `Progress ${safe}%`}>
      <span style={{ width: `${safe}%` }} />
    </div>
  );
}

