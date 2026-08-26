export default function CariLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 lg:px-12">
        <div className="h-9 w-56 animate-pulse rounded-full bg-sage-200/50" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-sage-100" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 animate-pulse rounded-full bg-sage-100"
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[var(--radius)] bg-white shadow-sm"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
