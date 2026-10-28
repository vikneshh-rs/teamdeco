# Team DeCo Portal — starter project

A Next.js starter for a Team DeCo marketing site plus client project lookup and management portal, styled in a light Apple-inspired direction with cool blue, bold black, beige and gold accents, rounded surfaces and selective glass effects.

## Important status

This is a **UI starter / prototype**, not production-ready project management software yet:
- Landing page, client lookup, sample project dashboard and management login UI are included.
- The client demo page recognizes only the sample ID `DC-7F3K9P2Q`.
- The management login form is intentionally not wired to authentication.
- Project records are not yet connected to Supabase and create/edit actions are not implemented.
- Do not publish real client data until database access controls and server-side authentication are implemented.

## Run locally

1. Install Node.js LTS.
2. Extract this project.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and fill values when Supabase is configured.
5. Run `npm run dev`, then open `http://localhost:3000`.

## Deploy to Vercel

1. Push the project to a private GitHub repository.
2. Import the repository in Vercel.
3. Deploy a preview first.
4. Configure environment variables in Vercel Project Settings.
5. Add `teamdeco.in` in Vercel Project Settings → Domains and follow the exact DNS records shown.
6. Test all routes and security before directing production traffic.

## Next implementation milestones

1. Supabase schema for projects, milestones and client-visible updates.
2. Server-side admin authentication using a password hash, secure HTTP-only session cookie, rate limiting and environment secrets.
3. Protected project CRUD endpoints and admin project list/create/edit screens.
4. Client lookup API that returns only approved public fields; use high-entropy project access IDs and rate limiting.
5. Supabase Row Level Security and deployment URL validation.
6. Production tests, accessibility review and responsive QA.

## Routes

- `/` — landing page
- `/client` — project ID lookup
- `/client/project?id=DC-7F3K9P2Q` — sample project dashboard
- `/manage` — management login UI
