

import Image from "next/image";
import { getPopularMovies, type TMDBMovie } from "@/lib/tmdb";

export default async function Home() {
  let movies: TMDBMovie[];

  try {
    movies = await getPopularMovies();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading popular movies.";

    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Popular movies</h1>
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          Could not load popular movies. {message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popular movies
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The latest popular titles from TMDB.
          </p>
        </header>

        {movies.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No popular movies are available right now.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Poster for ${movie.title}`}
                    width={500}
                    height={750}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-zinc-200 px-6 text-center text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    No poster available
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold leading-snug">
                    {movie.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {movie.release_date || "Release date unavailable"}
                    <span aria-hidden="true"> · </span>
                    TMDB rating: {movie.vote_average.toFixed(1)}/10
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {movie.overview || "No overview available."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
