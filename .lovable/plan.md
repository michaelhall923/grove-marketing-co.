## Diagnosis

Your dev server in the sandbox is actually running fine (Vite is up on port 8080). The "Preview has not been built yet" message you're seeing is coming from Lovable's hosted preview/build pipeline, not the local dev server — and there is one clear deviation from Lovable's standard Vite setup that explains it.

### The deviation

`.gitignore` contains:

```
# env files (can opt-in for committing if needed)
.env*
```

This is the Next.js-era ignore rule left over from the migration described in `README.md` ("migrated from the legacy Next.js + Builder.io site"). On Lovable's classic Vite + Lovable Cloud stack, the managed `.env` file holds:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

`src/integrations/supabase/client.ts` reads these via `import.meta.env.VITE_SUPABASE_*`. Because `.env*` is gitignored, the managed `.env` never makes it into the committed source the hosted preview builds from, so the build either fails or boots without the values and the preview never reports as "built".

Other parts of the project look standard (Vite 5 + React 18, `@/` alias, `src/integrations/supabase/client.ts` untouched, edge function under `supabase/functions/contact`). The `.gitignore` is the outlier.

## Plan

1. Edit `.gitignore`: remove the `.env*` block so the Lovable-managed `.env` (with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) is tracked.
   - Keep ignoring secrets that should never be committed if needed (e.g. `.env.local`), but `.env` itself must be tracked on this stack.
2. Refresh / reconnect the Lovable Cloud integration so the managed `.env` is regenerated and committed.
3. Restart the preview; it should build cleanly.
4. If the published site (`grove-marketing-co.lovable.app`) was published from a broken state, republish after the preview is healthy.

No application code changes are required — only the ignore rule and a Cloud refresh.

## Technical details

- Lovable's classic Vite stack expects `VITE_*` public env vars to be present at build time via a committed `.env`. Unlike Next.js (which is typically deployed with platform env vars), Vite inlines `import.meta.env.VITE_*` at build time from whatever `.env` exists in the working tree.
- `vite-env.d.ts` only declares `VITE_RECAPTCHA_SITE_KEY`; the Supabase vars work regardless because `import.meta.env` is typed as `any` for undeclared keys, but you can add them later if you want stricter typing.
- The reCAPTCHA site key is hardcoded in `src/components/ContactForm.jsx`, so it is unaffected by this issue.
