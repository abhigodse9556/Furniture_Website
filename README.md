# Guruprasad Furniture — setup

Single Next.js app at the repo root (storefront, `/admin`, and `/api/*` on one origin). Deploy to Vercel with no Root Directory override.

## Firebase Console checklist

1. Create a **new** Firebase project.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create (production mode). Deploy rules from repo root:
   - `firestore.rules` (deny all client access; Admin SDK only)
4. **Storage** → get started. Deploy `storage.rules` (public read on product/banner paths; no client writes).
5. **Project settings → Your apps → Web** → register app → copy config into `.env.local`.
6. **Project settings → Service accounts → Generate new private key** → save JSON as `serviceAccount.json` (gitignored), or paste the JSON into `FIREBASE_SERVICE_ACCOUNT_JSON`.
7. **Authentication → Users → Add user** → create the shop-owner email/password.
8. Set that same email as `ADMIN_EMAIL` in `.env.local`.

## Environment

Copy `.env.example` → `.env.local` and fill in:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_*` | Web app config |
| `ADMIN_EMAIL` | Shop-owner email (server-only) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full service account JSON (preferred on Vercel) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Local path to service account file (optional alternative) |
| `FIREBASE_STORAGE_BUCKET` | Optional storage bucket override |

## Run locally

```bash
npm install
npm run seed    # once Firebase Admin credentials are set
npm run dev
```

- Storefront: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- API health: http://localhost:3000/api/health

Until Firebase Admin credentials are configured, the public site falls back to the built-in static catalog so pages still render.

## Deploy on Vercel

1. Import this repo — leave **Root Directory** empty (repo root).
2. **Framework Preset:** Next.js (leave Output Directory empty)
3. **Environment Variables** — add every key from `.env.example`:
   - All `NEXT_PUBLIC_FIREBASE_*`
   - `ADMIN_EMAIL`
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (paste the full JSON as one line)
   - `FIREBASE_STORAGE_BUCKET` if you use a custom bucket
4. Deploy. Admin and public API calls are same-origin (`/api/...`) — no CORS and no separate API host.

If an older Vercel project still has Root Directory set to `client`, clear that setting and redeploy.
