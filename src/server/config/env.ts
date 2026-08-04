export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  adminEmail: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || undefined,
  googleApplicationCredentials:
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || undefined,
  firebaseServiceAccountJson:
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || undefined,
  smtpHost: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT?.trim() || "587"),
  smtpUser: process.env.SMTP_USER?.trim() || undefined,
  smtpPass: process.env.SMTP_PASS?.trim() || undefined,
  smtpFrom: process.env.SMTP_FROM?.trim() || undefined,
  inquiryToEmail:
    process.env.INQUIRY_TO_EMAIL?.trim() ||
    process.env.INQUIRY_NOTIFY_EMAIL?.trim() ||
    undefined,
  inquiryCcEmail: process.env.INQUIRY_CC_EMAIL?.trim() || undefined,
  inquiryBccEmail: process.env.INQUIRY_BCC_EMAIL?.trim() || undefined,
  siteUrl: (
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
};
