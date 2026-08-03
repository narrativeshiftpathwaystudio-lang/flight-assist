export function FlightPathDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div
        className="h-px flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--color-sand-300) 0 6px, transparent 6px 14px)",
        }}
      />
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-clay-500">
        <path
          d="M21 3L11 13M21 3L14.5 21L11 13M21 3L3 9.5L11 13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="h-px flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--color-sand-300) 0 6px, transparent 6px 14px)",
        }}
      />
    </div>
  );
}
