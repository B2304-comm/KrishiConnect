# KrishiConnect

KrishiConnect is a modern fertilizer distribution platform designed to connect farmers, retailers, dealers, companies, and government stakeholders. It provides a centralized interface for stock visibility, booking management, supply chain tracking, and AI-driven crop recommendation.

## Features

- Real-time inventory tracking for fertilizer distribution
- Role-based access for farms, dealers, companies, and government teams
- Booking and order management workflows
- Supabase-backed authentication and database integration
- AI crop prediction service for fertilizer recommendations
- Responsive UI built with Vite, React, TypeScript, and Tailwind CSS

## Tech Stack

- Frontend: `Vite`, `React`, `TypeScript`, `Tailwind CSS`
- Backend / AI: `FastAPI`, `Uvicorn`, `Python`
- Database / Auth: `Supabase`

## Quick Start

```sh
npm install
npm run dev
```

Open `http://localhost:8080` in your browser.

## AI Backend Setup

The project includes an optional AI crop prediction service in the `ai/` folder.

To run both frontend and backend together on Windows:

```sh
npm run dev:full
```

This starts:

- Frontend at `http://127.0.0.1:8080`
- AI backend at `http://127.0.0.1:8001`

If you only need the AI backend:

```sh
npm run ai:dev
```

## Scripts

- `npm run dev` — Start the frontend development server
- `npm run ai:dev` — Start only the AI backend
- `npm run dev:full` — Run frontend and AI backend together
- `npm run build` — Build the production frontend bundle
- `npm run preview` — Preview the production build locally
- `npm run test` — Run the Vitest test suite

## Project Structure

- `src/` — Frontend application source code
- `ai/` — AI crop prediction API and model code
- `supabase/` — Database schema and migration files
- `public/` — Static assets
- `scripts/` — Local development helper scripts

## Deployment Notes

- Use Vercel or Netlify for the frontend deployment
- Deploy the AI backend on Railway, Render, or another Python hosting service
- Store Supabase credentials in environment variables for production

## Live Deployment Guide

### Frontend (Vercel)

1. Sign in to https://vercel.com with GitHub.
2. Click **New Project** and import `B2304-comm/KrishiConnect`.
3. Set **Framework Preset** to `Vite`.
4. Set **Build Command** to `npm run build`.
5. Set **Output Directory** to `dist`.
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`
7. Deploy the project.

### Backend (Railway / Render)

1. Create a new Python service and connect the same repository.
2. Use the command:
   ```sh
   uvicorn ai.api:app --host 0.0.0.0 --port $PORT
   ```
3. Add environment variables needed by the AI backend.
4. Deploy the service and copy the generated API URL.

### Connect frontend to backend

1. In Vercel, set `VITE_API_URL` to the backend URL.
2. Redeploy the frontend.

# KrishiConnect

KrishiConnect is a modern fertilizer distribution platform designed to connect farmers, retailers, dealers, companies, and government stakeholders. It provides a centralized interface for stock visibility, booking management, supply chain tracking, and AI-driven crop recommendation.

## Features

- Real-time inventory tracking for fertilizer distribution
- Role-based access for farms, dealers, companies, and government teams
- Booking and order management workflows
- Supabase-backed authentication and database integration
- AI crop prediction service for fertilizer recommendations
- Responsive UI built with Vite, React, TypeScript, and Tailwind CSS

## Tech Stack

- Frontend: `Vite`, `React`, `TypeScript`, `Tailwind CSS`
- Backend / AI: `FastAPI`, `Uvicorn`, `Python`
- Database / Auth: `Supabase`

## Quick Start

```sh
npm install
npm run dev
```

Open `http://localhost:8080` in your browser.

## AI Backend Setup

The project includes an optional AI crop prediction service in the `ai/` folder.

To run both frontend and backend together on Windows:

```sh
npm run dev:full
```

This starts:

- Frontend at `http://127.0.0.1:8080`
- AI backend at `http://127.0.0.1:8001`

If you only need the AI backend:

```sh
npm run ai:dev
```

## Scripts

- `npm run dev` — Start the frontend development server
- `npm run ai:dev` — Start only the AI backend
- `npm run dev:full` — Run frontend and AI backend together
- `npm run build` — Build the production frontend bundle
- `npm run preview` — Preview the production build locally
- `npm run test` — Run the Vitest test suite

## Project Structure

- `src/` — Frontend application source code
- `ai/` — AI crop prediction API and model code
- `supabase/` — Database schema and migration files
- `public/` — Static assets
- `scripts/` — Local development helper scripts

## Deployment Notes

- Use Vercel or Netlify for the frontend deployment
- Deploy the AI backend on Railway, Render, or another Python hosting service
- Store Supabase credentials in environment variables for production

## Live Deployment Guide

### Frontend (Vercel)

1. Sign in to https://vercel.com with GitHub.
2. Click **New Project** and import `B2304-comm/KrishiConnect`.
3. Set **Framework Preset** to `Vite`.
4. Set **Build Command** to `npm run build`.
5. Set **Output Directory** to `dist`.
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`
7. Deploy the project.

### Backend (Railway / Render)

1. Create a new Python service and connect the same repository.
2. Use the command:
   ```sh
   uvicorn ai.api:app --host 0.0.0.0 --port $PORT
   ```
3. Add environment variables needed by the AI backend.
4. Deploy the service and copy the generated API URL.

### Connect frontend to backend

1. In Vercel, set `VITE_API_URL` to the backend URL.
2. Redeploy the frontend.

## Contact

For questions or updates, open an issue in the repository or connect via GitHub.

---

*Last updated: April 7, 2026*
