
# Migrate `/api/contact` to the Lovable way

Replace the Vercel serverless function with a Lovable Cloud edge function, log every submission to a database table, and remove Vercel-specific files.

## 1. Enable Lovable Cloud

Provisions the backend (database, edge functions, secrets) — no external account needed.

## 2. Create `contact_submissions` table (migration)

```text
contact_submissions
  id              uuid  pk default gen_random_uuid()
  created_at      timestamptz default now()
  first_name      text  not null
  last_name       text  not null
  email_address   text  not null
  phone_number    text  not null
  company_name    text  not null
  notes           text  default ''
  recaptcha_score numeric
  email_sent      boolean default false
  email_error     text
  user_agent      text
  ip              text
```

- `GRANT ALL ON public.contact_submissions TO service_role;` (edge function writes via service role)
- No grants to `anon`/`authenticated` — leads should not be browsable from the client
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` with no policies (locked down; service role bypasses RLS)

## 3. Add secrets via the secrets tool

`RECAPTCHA_SECRET_KEY`, `RECAPTCHA_MIN_SCORE` (optional), `RECAPTCHA_HOSTNAME` (optional), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO`.

These live in Lovable Cloud — not in a committed `.env`.

## 4. Edge function `supabase/functions/contact/index.ts`

- Deno runtime, public (no JWT — anonymous form)
- CORS headers on every response (including errors and OPTIONS preflight)
- Validate body with `zod` (`npm:zod`)
- Verify reCAPTCHA via `fetch` to Google (same logic as today: success, action match, score gate, optional hostname pinning)
- Send email with `npm:nodemailer` using existing SMTP env vars (same HTML/text template as today, ported verbatim)
- Insert a row into `contact_submissions` (success or failure) using service-role client — so leads survive email outages
- Return `{ ok: true, emailSent: true }` on success; structured errors otherwise (matching current client expectations)

`supabase/config.toml` entry sets `verify_jwt = false` for the `contact` function.

## 5. Update `ContactForm.jsx`

- Replace `fetch('/api/contact', ...)` with `supabase.functions.invoke('contact', { body: { ...payload, recaptchaToken, recaptchaAction } })`
- Keep all existing field validation, reCAPTCHA v3 token retrieval, and error-rendering logic unchanged
- Error shape from the edge function will mirror today's (`{ ok, error, score? }`) so the existing `applyZodFlattenErrors` path keeps working

## 6. Delete Vercel-only artifacts

- `api/contact.js`
- `vercel.json`
- The `/api` proxy block in `vite.config.ts` (no longer needed; edge functions are called by SDK)

`nodemailer` and `zod` move from app deps to edge-function imports (via `npm:` specifiers), so we can also drop `nodemailer` from `package.json` if it isn't used elsewhere.

## 7. Verify

- Open the form, submit a test lead
- Confirm the row appears in `contact_submissions`
- Confirm the email arrives at `EMAIL_TO`
- Confirm a deliberately bad payload returns field-level errors and renders inline

## Risks / notes

- SMTP from Deno edge functions via `npm:nodemailer` works but is heavier than a Resend/Lovable Email call; if deliverability or cold-start latency becomes an issue, switching to Lovable Email is a small follow-up (template + provider swap, no client changes).
- reCAPTCHA hostname pinning currently only enforces in `VERCEL_ENV === 'production'`. In the edge function we'll gate it on a new `ENFORCE_RECAPTCHA_HOSTNAME=true` secret (default off) so behavior stays predictable across preview/published.
- Removing `vercel.json` means Vercel deploys are no longer supported — confirmed desired.
