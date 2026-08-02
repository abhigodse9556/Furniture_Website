export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  adminEmail: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || undefined,
  googleApplicationCredentials:
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || undefined,
  firebaseServiceAccountJson:
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || undefined,
};
