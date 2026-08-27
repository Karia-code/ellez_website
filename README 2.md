# ELLEZ LLC Website

Static company website hosted from `public/` with a Vite/React admin dashboard built into `public/admin/`. Firebase is used for Hosting, Authentication, and Firestore updates.

## Local structure

- `public/` — public website and product pages
- `public/apps/` — product pages (Stall POS, What to Eat, MiniAppsLab)
- `admin-app/` — React admin dashboard source
- `public/admin/` — generated admin build output (created by `npm run build:admin`; not required in source control)
- `functions/` — Firebase Functions scaffold
- `firebase.json` — Firebase Hosting configuration

## Install

```bash
npm install
cd admin-app && npm install && cd ..
```

Copy `.env.example` to `.env` only if you want to override the Firebase web configuration locally. Do not commit `.env`.

## Development

Admin dashboard:

```bash
npm run dev:admin
```

Firebase emulators / local hosting:

```bash
npm run serve
```

## Build and deploy

```bash
npm run deploy
```

`predeploy` builds the admin dashboard before Firebase deploys the `public/` directory.

## MiniAppsLab

Product pages:

- English: `/apps/miniappslab/en/`
- Traditional Chinese: `/apps/miniappslab/zh/`

## Security notes

Firebase web configuration is intentionally public client configuration. Authorization must be enforced with Firebase Authentication and Firestore Security Rules. Never commit private service-account credentials or `.env` secrets.
