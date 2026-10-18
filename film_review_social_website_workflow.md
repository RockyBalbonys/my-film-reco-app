# Film Review & Social Website — Development Workflow

## 1. Project Goal

Build a film review and social website inspired by Letterboxd. Users should be able to discover movies, log watched films, rate and review them, maintain watchlists, and interact with other movie fans.

### Proposed Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers and server-side logic
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Movie metadata:** The Movie Database (TMDB) API
- **Version control:** Git and GitHub
- **Deployment:** Vercel
- **Testing:** Vitest for unit tests; Playwright for end-to-end tests

> **Licensing note:** Check TMDB's current terms and attribution requirements. Free API access is generally intended for qualifying non-commercial use; commercial projects may require a separate license.

---

## 2. MVP Scope

Build the core product first. Avoid adding advanced features before the main user journeys work.

### Phase 1 — Movie Discovery

- [ ] Display popular or trending movies on the homepage.
- [ ] Search for movies through TMDB.
- [ ] Create a movie details page.
- [ ] Display posters, synopsis, release date, genres, and cast where available.
- [ ] Display reviews associated with a movie.
- [ ] Add loading, empty, and error states.
- [ ] Add pagination or a load-more interaction.

### Phase 2 — Accounts and Profiles

- [ ] Implement sign-up, login, and logout.
- [ ] Configure Supabase Auth.
- [ ] Create a profile when a user signs up.
- [ ] Allow users to edit their username, bio, and avatar.
- [ ] Create public profile pages.
- [ ] Protect actions that require authentication.
- [ ] Configure and test Row Level Security (RLS) policies.

### Phase 3 — Reviews and Film Tracking

- [ ] Allow users to rate a movie.
- [ ] Allow users to write, edit, and delete their own reviews.
- [ ] Display reviews on movie detail pages.
- [ ] Display a user's reviews on their profile.
- [ ] Allow users to mark movies as watched.
- [ ] Allow users to add and remove movies from their watchlist.
- [ ] Prevent duplicate review and watchlist records where appropriate.

### Phase 4 — Social Features

- [ ] Follow and unfollow users.
- [ ] Like and unlike reviews.
- [ ] Comment on reviews.
- [ ] Build a feed from followed users.
- [ ] Display user activity on profiles.
- [ ] Prevent duplicate follows and likes.

### Phase 5 — Testing and Launch

- [ ] Test the main user journeys.
- [ ] Test database permissions and authorization.
- [ ] Add unit tests for validation and business logic.
- [ ] Add end-to-end tests for important flows.
- [ ] Check mobile responsiveness and accessibility.
- [ ] Handle API failures, loading states, and empty results.
- [ ] Configure production environment variables.
- [ ] Deploy the application.
- [ ] Verify the production build and key user journeys.

---

## 3. High-Level Architecture

```text
                         ┌─────────────────────────┐
                         │       Next.js UI        │
                         │ Home · Explore · Movie  │
                         │ Reviews · Feed · Profile│
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │     Next.js Server      │
                         │ Route Handlers, server │
                         │ logic, validation      │
                         └────────┬────────┬──────┘
                                  │        │
                       ┌──────────▼─┐   ┌──▼────────────────┐
                       │  TMDB API  │   │     Supabase      │
                       │ Movie data │   │ PostgreSQL, Auth, │
                       │ and search │   │ user-generated data│
                       └────────────┘   └───────────────────┘
```

### Responsibilities

- **TMDB:** Movie metadata, search, posters, genres, cast, and discovery lists.
- **Supabase:** Profiles, reviews, ratings, watched movies, watchlists, follows, likes, and comments.
- **Next.js:** Pages, server-side integration, business logic, input validation, and secure API access.

Do not manually create every movie. Store the TMDB movie ID with user activity and fetch movie metadata as needed. If the project later needs its own catalog, cache, or curated lists, add a local `movies` table deliberately.

---

## 4. Initial Database Design

This is a starting point; adjust it as the product requirements become clearer.

| Table | Example fields | Purpose |
|---|---|---|
| `profiles` | `id`, `username`, `bio`, `avatar_url` | Public user profiles |
| `reviews` | `id`, `user_id`, `tmdb_movie_id`, `rating`, `review_text`, `created_at` | Movie ratings and written reviews |
| `watched_movies` | `user_id`, `tmdb_movie_id`, `watched_at` | Watched-film history |
| `watchlists` | `user_id`, `tmdb_movie_id`, `created_at` | Movies a user wants to watch |
| `follows` | `follower_id`, `following_id`, `created_at` | Following relationships |
| `review_likes` | `user_id`, `review_id`, `created_at` | Review likes |
| `comments` | `id`, `user_id`, `review_id`, `content`, `created_at` | Comments on reviews |

### Database Rules to Consider

- Use primary keys and foreign keys where appropriate.
- Link `profiles.id` to `auth.users.id`.
- Add a unique constraint to `(user_id, tmdb_movie_id)` in `reviews` if each user can have only one review per movie.
- Add unique constraints to prevent duplicate watchlist entries, follows, and likes.
- Prevent users from following themselves.
- Validate ratings in the application and database, for example a rating between `0.5` and `5.0`.
- Add indexes for common filters and joins, such as review lookups by movie and feed lookups by user.
- Enable RLS on user-related tables.
- Ensure users can only modify their own reviews, profile, and other protected records.
- Define whether reviews, profiles, and activity are public or private.

---

## 5. Suggested Next.js Route Structure

```text
app/
├── page.tsx
├── explore/
│   └── page.tsx
├── movies/
│   └── [id]/
│       └── page.tsx
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
├── feed/
│   └── page.tsx
├── profile/
│   └── [username]/
│       └── page.tsx
├── watchlist/
│   └── page.tsx
├── settings/
│   └── page.tsx
└── api/
    └── movies/
        └── search/
            └── route.ts

components/
├── movies/
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   └── MovieSearch.tsx
├── reviews/
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   └── RatingInput.tsx
├── social/
│   ├── FollowButton.tsx
│   └── CommentSection.tsx
└── layout/
    ├── Navbar.tsx
    └── Footer.tsx

lib/
├── tmdb.ts
├── supabase/
├── validations/
└── utils/
```

This is a suggested structure, not a requirement to create every file immediately. Add files as each feature is implemented.

---

## 6. Development Workflow for Each Feature

Use this loop for every feature:

1. **Define the feature:** Describe the user story and what “done” means.
2. **Plan the data:** Decide which tables, fields, constraints, and policies are needed.
3. **Create a branch:** Use a short descriptive name, such as `feature/movie-reviews`.
4. **Build the UI:** Create the page or components with loading, empty, and error states.
5. **Implement server logic:** Validate input and keep secrets on the server.
6. **Connect the service:** Integrate TMDB or Supabase as needed.
7. **Test:** Check normal use, invalid input, unauthenticated use, and unauthorized access.
8. **Review:** Check code quality, responsive layouts, and accessibility.
9. **Commit and push:** Use descriptive commit messages.
10. **Merge and verify:** Merge into `main` after checks pass and verify deployment.

Example commit messages:

```text
feat: add movie review form
fix: prevent duplicate review likes
test: cover movie search validation
```

### Simple Git Flow

```text
main
 └── feature/movie-reviews
      ├── implement UI and logic
      ├── test feature
      └── commit and push
             │
             ▼
       review and merge
             │
             ▼
      verify deployment
```

For a solo project, keep the branching strategy simple. A feature branch is useful but not mandatory for every tiny change.

---

## 7. Testing Checklist

Test full user journeys rather than only individual components.

| Scenario | Expected result |
|---|---|
| Visitor searches for a movie | Relevant results appear |
| Visitor opens a movie | Details and existing reviews load |
| User signs up | Account and profile are created correctly |
| User submits a review | Review appears on the movie page and their profile |
| User edits a review | Only their review is updated |
| User adds a watchlist item | It appears in their watchlist |
| User follows someone | Their reviews can appear in the feed |
| User likes a review repeatedly | Only one like is recorded |
| User tries to edit another user's review | Database operation is denied |
| TMDB request fails | Useful error or retry option appears |
| User is logged out | Protected actions require authentication |

Security checks are essential. Hiding an edit button in the UI is not sufficient; enforce authorization with Supabase RLS and server-side validation.

---

## 8. Suggested Timeline

This is a rough estimate for one developer working part-time. Adjust it based on experience, available time, and scope.

| Period | Goal |
|---|---|
| Week 1 | Project setup, shared layout, movie discovery |
| Week 2 | Movie search, details, responsive design |
| Week 3 | Authentication and profiles |
| Weeks 4–5 | Reviews, ratings, watched status, watchlists |
| Weeks 6–7 | Following, likes, comments, and feed |
| Weeks 8–10 | Testing, polish, deployment, and buffer |

A polished product may take longer. Prioritize a complete, reliable core experience over hitting an arbitrary deadline.

---

## 9. First Milestone: Movie Discovery

Start here before implementing social features.

- [ ] Initialize Next.js with TypeScript and Tailwind CSS.
- [ ] Create a GitHub repository and make the initial commit.
- [ ] Set up Supabase and local environment variables.
- [ ] Get the TMDB API token working in server-side code.
- [ ] Build a homepage with a movie grid.
- [ ] Build movie search.
- [ ] Build a movie details page using the TMDB movie ID.
- [ ] Add loading, empty, and error states.
- [ ] Verify that API secrets are not exposed to browser code.
- [ ] Commit and push the working version.

### Definition of Done

The first milestone is complete when a visitor can open the website, browse movies, search for a title, and view a movie's details on desktop and mobile—with reasonable error handling.

---

## 10. Scope Discipline

- Do not add Redis, microservices, or a separate Express backend until the project has a clear need for them.
- Do not store a full copy of the TMDB catalog without a specific reason and a clear understanding of the data licensing requirements.
- Keep API keys and privileged Supabase credentials on the server.
- Use database migrations or versioned SQL for schema changes.
- Build and test one end-to-end feature at a time.
- Keep a `README.md` with setup steps, environment variables, and project scripts.
- Make regular Git commits and avoid committing `.env` files.

**Guiding principle:** Treat movie metadata as shared external data, and treat reviews and social interactions as your application's own data. This separation keeps the initial implementation manageable and leaves room to grow.
