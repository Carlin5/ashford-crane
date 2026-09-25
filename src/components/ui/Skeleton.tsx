export function Skeleton({
  className = "",
  lines = 0,
}: {
  className?: string;
  lines?: number;
}) {
  if (lines > 0) {
    return (
      <div className="flex flex-col gap-2" aria-hidden>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    );
  }
  return <div className={`skeleton rounded ${className}`} aria-hidden />;
}
