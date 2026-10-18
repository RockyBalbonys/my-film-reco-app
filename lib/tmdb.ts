import "server-only";

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

interface TMDBPopularMoviesResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

function isTMDBMovie(value: unknown): value is TMDBMovie {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const movie = value as Record<string, unknown>;
  return (
    typeof movie.id === "number" &&
    typeof movie.title === "string" &&
    (typeof movie.poster_path === "string" || movie.poster_path === null) &&
    typeof movie.release_date === "string" &&
    typeof movie.overview === "string" &&
    typeof movie.vote_average === "number"
  );
}

function isTMDBPopularMoviesResponse(
  value: unknown,
): value is TMDBPopularMoviesResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;
  return (
    typeof response.page === "number" &&
    Array.isArray(response.results) &&
    response.results.every(isTMDBMovie) &&
    typeof response.total_pages === "number" &&
    typeof response.total_results === "number"
  );
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "TMDB_ACCESS_TOKEN is missing. Add your TMDB API Read Access Token to .env.local and restart the development server.",
    );
  }

  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=4",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!isTMDBPopularMoviesResponse(data)) {
    throw new Error("TMDB returned an unexpected popular movies response.");
  }

  console.log("data: ", data);

  return data.results;
}
