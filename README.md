# Grove Marketing Co.

Marketing site on the Lovable stack (Vite + React + React Router + Tailwind CSS v4), migrated from the legacy Next.js + Builder.io site.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router** for client-side routing
- **Tailwind CSS v4** (design tokens in `src/index.css`)
- **Vercel** serverless function for the contact form (`api/contact.js`)

Builder.io is **not** used at runtime. CMS content was exported once to `src/content/` via `npm run export:content`.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:8080

### Contact form locally

The contact API runs as a Vercel serverless function. For local testing with a working `/api/contact` endpoint, use [Vercel CLI](https://vercel.com/docs/cli):

```bash
vercel dev
```

Copy `.env.example` to `.env` and fill in reCAPTCHA + SMTP values.

Client env var: `VITE_RECAPTCHA_SITE_KEY`

## Build

```bash
npm run build
npm run preview
```

## Routes

| Path | Page |
|------|------|
| `/` | Homepage (animated ocean hero) |
| `/services/*` | Service pages |
| `/galleries/mrc2025` | MRC 2025 photo gallery |
| `/articles/:slug` | Blog articles (static CMS export) |
| `/about-us` | About page (static CMS export) |
