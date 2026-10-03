# Eventra (Phase 1 — website)

Create event websites (weddings, birthdays, celebrations…) and share them with guests.
Built with Next.js 16 (App Router), TypeScript, Tailwind 4, PostgreSQL, Prisma 7, Auth.js v5, Zod.

**Status:** website, auth (email + Google), dashboard, event wizard/editing, templates, public pages and
live streaming through LiveKit Cloud are done. No recording, replay, payments or storage yet.

## Setup

```bash
npm install
createdb eventlive
cp .env.example .env.local   # fill DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate dev
npm run dev
```

No Docker needed. Never commit `.env.local`.

## Live streaming (LiveKit Cloud)

Create a project at https://cloud.livekit.io and set `LIVEKIT_URL` (wss://…), `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` in `.env.local`.

- Owner opens `/event/[slug]/live` → **START LIVE**. Guests watch on `/event/[slug]` (no account).
- `POST /api/livekit/token` decides the role on the **server**: `broadcaster` needs a logged-in owner of the event
  (else 401/403); everyone else only ever gets a subscribe-only token. Viewer tokens are issued only while LIVE.
- Room name: `event_<eventId>`. Viewer count comes from LiveKit participants (identities starting `guest-`).
- The broadcaster page sends a heartbeat every 15s; a LIVE stream with no heartbeat for 60s is treated as ended.
- **Phones need HTTPS for the camera.** `localhost` works on the same computer, but a phone using your LAN IP over
  plain http cannot access the camera. Use `npx next dev --experimental-https` or a tunnel such as Cloudflare Tunnel or ngrok,
  and set `AUTH_URL` to that https address.

## Photos, wedding card & video (Cloudflare R2)

Owners upload on the event edit page. Files go **directly from the browser to R2** (presigned URLs); the server checks
login, ownership, file type and size first, then verifies the object before saving it.

1. Cloudflare dashboard → R2 → create a bucket. Enable **Public access** (r2.dev subdomain or a custom domain) and copy the public URL.
2. R2 → Manage API tokens → create a token with **Object Read & Write** for that bucket. Note the Account ID, Access Key ID and Secret.
3. Bucket → Settings → **CORS policy** (allow your site and localhost to upload):
   ```json
   [{
     "AllowedOrigins": ["http://localhost:3001", "https://your-app.vercel.app"],
     "AllowedMethods": ["PUT", "GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }]
   ```
4. `.env.local` (and Vercel env vars): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` (no trailing slash).

Limits: photos 10 MB (max 30), card 10 MB (1), videos 500 MB (max 3, MP4/WebM/MOV).

## Google login (optional)

1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (use your real port, e.g. 3001, and add your production URL later).
3. Put the values in `.env.local`: `AUTH_GOOGLE_ID=…` and `AUTH_GOOGLE_SECRET=…`, then restart `npm run dev`.

The "Continue with Google" button appears only when `AUTH_GOOGLE_ID` is set. Only Google-verified emails are accepted, and a Google sign-in with an email that already exists signs into that same account.

## Structure

- `src/app` — routes: `/`, `/login`, `/register`, `/dashboard`, `/dashboard/events/[id]`, `/create-event`, `/event/[slug]`, `/event/[slug]/live`
- `src/lib/templates.ts` — template themes; one `<EventSite>` renders all of them
- `src/lib/event-types.ts` — one flexible Event model, per-type labels (Wedding = bride/groom)
- `src/lib/actions` — server actions (auth, events) with Zod validation and ownership checks
- `prisma/schema.prisma` — User, Event, EventSchedule, LiveStream

## Checks

```bash
npm run typecheck && npm run lint && npm run build
```
