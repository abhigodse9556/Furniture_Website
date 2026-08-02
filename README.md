# Guruprasad Furniture — setup

## Firebase Console checklist

1. Create a **new** Firebase project (do not reuse chat-app).
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create (production mode). Deploy rules from repo root:
   - `firestore.rules` (deny all client access; Express Admin SDK only)
4. **Storage** → get started. Deploy `storage.rules` (public read on product/banner paths; no client writes).
5. **Project settings → Your apps → Web** → register app → copy config into `client/.env.local`.
6. **Project settings → Service accounts → Generate new private key** → save JSON as `server/serviceAccount.json` (gitignored).
7. **Authentication → Users → Add user** → create the shop-owner email/password.
8. Set that same email as `ADMIN_EMAIL` in `server/.env`.

## Environment files

- Copy `client/.env.example` → `client/.env.local`
- Copy `server/.env.example` → `server/.env`

## Run locally

```bash
# Terminal 1 — API
cd server
npm install
npm run seed    # once Firebase credentials are set
npm run dev

# Terminal 2 — storefront + /admin
cd client
npm install
npm run dev
```

- Storefront: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- API health: http://localhost:4000/health

Until the API/Firebase are configured, the public site falls back to the built-in static catalog so pages still render.
