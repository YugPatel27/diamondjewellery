# Jewellery

A modern web application for displaying and managing jewellery items. This repository contains a Vite + React (TypeScript) frontend and a small Node.js/Express server in `server/` for API endpoints and backend utilities.

## Features

- Fast development with Vite
- TypeScript on the frontend
- Small Node-based API for server-side operations
- Local data storage for development under `data/db/` (do not commit)

## Tech stack

- Frontend: Vite, React, TypeScript
- Backend: Node.js, Express (in `server/`)
- Styling: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm or pnpm
- Optional: Git

## Quick start

1. Install dependencies

```bash
npm install
# or
pnpm install
```

2. Create environment files

This project uses environment files for configuration. Never commit secrets.

- Copy the sample env file(s):

```bash
cp .env.example .env
cp server/.env.example server/.env
```

- Keep secret keys, API tokens, and private credentials out of version control. See `.gitignore`.

3. Run the dev servers (frontend + optional backend)

```bash
# Frontend
npm run dev

# In another terminal, run server (if used)
node server/index.js
```

## Environment files and secrets

- This repository's `.gitignore` excludes `.env` and related files. Add any environment-specific files you need locally, e.g. `.env.local`, but never push them.
- Example env variables (place in `.env` and `server/.env` as appropriate).
- 

## Data and local databases

- Local DB files and binary store under `data/db/` are ignored by `.gitignore`. Do not commit database files or export dumps containing sensitive data.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — build the frontend
- `npm run preview` — preview the production build
- `node server/index.js` — run the backend server (or run via `npm` script in `server/package.json`)

Check `package.json` and `server/package.json` for other available scripts.

## Testing

- Unit and integration tests (if present) can be run via the configured test runner. Example:

```bash
npm test
```

## Linting & Formatting

- This project uses standard linters and formatters. Run them with:

```bash
npm run lint
npm run format
```

## Deployment

- This repository includes a `vercel.json` for Vercel deployments and general build settings. Configure environment variables in your hosting provider rather than committing them.

## Project structure (high level)

- `src/` — frontend source code
- `public/` — static assets
- `server/` — backend server code and scripts

## Contributing

- Please open issues and PRs. For local development, ensure you do not commit secret files or database dumps.

## Security & Privacy

- Do not add any private keys, certificates, or passwords to the repository. Use environment variables and secrets management for production.

## Preview
<img width="1904" height="930" alt="Diamond E-Commerce Platform" src="https://github.com/user-attachments/assets/dc4f3131-a915-4efc-9467-11bffbc18537" />
