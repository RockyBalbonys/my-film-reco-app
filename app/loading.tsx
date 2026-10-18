export default function Loading() {
  return (
    <main
      aria-label="Loading popular movies"
      className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <p className="sr-only">Loading popular movies…</p>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="aspect-[2/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
