
## Overview

Add a raffle system (enter/draw/admin), site-wide auth with a `/login` page, and an admin role tied to `@grovemarketingco.com` emails. None of these routes will be linked from the header, footer, or anywhere else — direct URL access only, and all noindexed.

## Pages

### `/raffle/enter` (public, noindex)
- Form: Name, Email, Phone Number (zod-validated, styled to match the existing contact form).
- On submit: insert into `raffle_entries`.
- Show a centered "Thanks for entering!" popup with a fade/scale animation, auto-dismiss after ~2.5s, then reset the form.

### `/raffle/draw` (public, noindex)
- Large "SPIN" button (oversized typography matching site's Franklin Gothic display style).
- On click: fetch all entry names, then run a slot-machine style animation that cycles names rapidly, eases out, and lands on the actual winner (picked server-side via an edge function for fairness).
- Winner name displays huge (readable from across a room) + a confetti burst overlay.
- Entries are left untouched — same person could win again on subsequent spins.

### `/raffle/admin` (admin only, noindex)
- Single big "Delete all entries" button with a confirm step.
- If not logged in OR not an admin → redirect to `/login`.

### `/login` (public, noindex)
- Email + password sign in / sign up (toggle).
- Anyone can create an account. Admin status is derived automatically from email domain (no manual role assignment needed).
- After login: redirect back to wherever they came from (or `/` if no referrer).

## Backend

### `raffle_entries` table
Columns: `id`, `name`, `email`, `phone`, `created_at`.

RLS:
- INSERT: anyone (anon + authenticated) — public raffle entry.
- SELECT: admins only (used by the draw page).
- DELETE: admins only.

### Roles
- `app_role` enum with `admin` value.
- `user_roles` table (separate from profiles, per security best practice).
- `has_role(user_id, role)` security-definer function.
- `is_admin_email(email)` helper: returns true when email ends with `@grovemarketingco.com`.
- Trigger on `auth.users` insert: if the new user's email matches the admin domain, insert an `admin` row into `user_roles`.

### Edge functions
- `raffle-draw`: admin-only (verifies JWT + admin role), returns a randomly selected entry. Used by `/raffle/draw` so the winner is chosen server-side.
- `raffle-reset`: admin-only, deletes all rows from `raffle_entries`. Used by `/raffle/admin`.

## Auth wiring

- Enable email/password auth, disable auto-confirm (standard) — actually, since this is internal admin use, enable auto-confirm so signups work without an email step. Will confirm before applying.
- Add `supabase.auth.onAuthStateChange` listener + `getSession` hydration in a small `AuthProvider` context.
- `RequireAdmin` route wrapper used by `/raffle/admin` and `/raffle/draw`'s admin-only fetch.
  - Note: `/raffle/draw` itself is public to view (so anyone can run the draw at an event), but the winner-selection edge function requires admin. If you'd prefer `/raffle/draw` also be admin-gated, say the word.

## Styling

- Reuse existing tokens (`--color-grove-*`, Franklin Gothic headers, Georgia body, the orange `#e27c22` button).
- Forms use existing global `input` styling already in `src/index.css`.
- Confetti via a small dependency (`canvas-confetti`) — lightweight, no React wrapper needed.
- All raffle pages get `<SEO robots="noindex, nofollow" />` like the MRC2025 gallery.

## Files to add/change

- `supabase/migrations/<new>.sql` — roles enum, `user_roles`, `has_role`, admin-email trigger, `raffle_entries` + RLS + GRANTs.
- `supabase/functions/raffle-draw/index.ts`
- `supabase/functions/raffle-reset/index.ts`
- `src/lib/auth.tsx` — AuthProvider + `useAuth` + `useIsAdmin`.
- `src/components/RequireAdmin.tsx`
- `src/pages/Login.tsx`
- `src/pages/raffle/Enter.tsx`
- `src/pages/raffle/Draw.tsx`
- `src/pages/raffle/Admin.tsx`
- `src/App.tsx` — add routes `/login`, `/raffle/enter`, `/raffle/draw`, `/raffle/admin`; wrap router tree in `AuthProvider`.
- `package.json` — add `canvas-confetti`.

## Open question (one)

Should `/raffle/draw` be **viewable by anyone** (only the winner-pick API is admin-gated), or **fully admin-gated** so even loading the page requires login? Default in the plan: viewable by anyone, draw API admin-only — but easy to flip.
