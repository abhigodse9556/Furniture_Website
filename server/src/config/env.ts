import "dotenv/config";

/** CORS origins must include the scheme (https://…). Host-only values are invalid. */
function normalizeClientOrigin(raw: string | undefined): string {
  const value = raw?.trim() || "http://localhost:3000";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");
  const host = value.replace(/\/$/, "");
  const scheme = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : "https";
  return `${scheme}://${host}`;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: normalizeClientOrigin(process.env.CLIENT_ORIGIN),
  adminEmail: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || undefined,
  googleApplicationCredentials:
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || undefined,
  firebaseServiceAccountJson:
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || undefined,
};
