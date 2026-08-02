import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN?.trim() || "http://localhost:3000",
  adminEmail: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || undefined,
  googleApplicationCredentials:
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || undefined,
  firebaseServiceAccountJson:
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || undefined,
};
