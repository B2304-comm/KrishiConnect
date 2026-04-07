# KrishiConnect

KrishiConnect is a fertilizer distribution platform that helps farmers, retailers, dealers, companies, and government teams manage stock visibility, bookings, and supply chain tracking.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase

## Local Development

```sh
npm install
npm run dev
```

The app runs on `http://localhost:8080` by default.

## AI Crop Prediction Setup

To run the frontend and AI backend together in local development on Windows:

```sh
npm run dev:full
```

This starts:

- frontend on `http://127.0.0.1:8080`
- AI backend on `http://127.0.0.1:8001`

If you only want the AI backend:

```sh
npm run ai:dev
```

The frontend uses a local Vite proxy in development, so the AI tools work without extra browser CORS setup.

## Available Scripts

- `npm run dev` starts the development server.
- `npm run ai:dev` starts the Python AI backend only.
- `npm run dev:full` starts both the AI backend and the frontend for local development.
- `npm run build` creates a production build.
- `npm run preview` previews the production build locally.
- `npm run test` runs the Vitest test suite.

## Project Structure

- `src/` contains the frontend application.
- `supabase/` contains database configuration and SQL migrations.
- `ai/` contains the crop prediction service and model assets.
