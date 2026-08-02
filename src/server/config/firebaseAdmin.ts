import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ServiceAccount } from "firebase-admin";

import { config } from "./env";

let app: App | null = null;
let db: Firestore | null = null;

function parseServiceAccountJson(raw: string): ServiceAccount {
  const trimmed = raw.trim();
  // Vercel sometimes stores JSON with surrounding quotes.
  const unquoted =
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ? trimmed.slice(1, -1)
      : trimmed;

  const parsed = JSON.parse(unquoted) as ServiceAccount & {
    private_key?: string;
  };

  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  return parsed;
}

function loadServiceAccount(): ServiceAccount {
  if (config.firebaseServiceAccountJson) {
    return parseServiceAccountJson(config.firebaseServiceAccountJson);
  }

  if (config.googleApplicationCredentials) {
    const absolutePath = resolve(config.googleApplicationCredentials);
    const raw = readFileSync(absolutePath, "utf8");
    return parseServiceAccountJson(raw);
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

export function getFirebaseApp(): App {
  if (app) return app;

  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  const serviceAccount = loadServiceAccount();
  const bucket =
    config.storageBucket ||
    `${(serviceAccount as ServiceAccount & { project_id?: string }).project_id}.appspot.com`;

  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: bucket,
  });
  return app;
}

export function getDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}

export async function getAdminAuth() {
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(getFirebaseApp());
}

export function getBucket() {
  return getStorage(getFirebaseApp()).bucket();
}
