import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ServiceAccount } from "firebase-admin";

import { config } from "./env";

let app: App | null = null;
let db: Firestore | null = null;

function loadServiceAccount(): ServiceAccount {
  if (config.firebaseServiceAccountJson) {
    return JSON.parse(config.firebaseServiceAccountJson) as ServiceAccount;
  }

  if (config.googleApplicationCredentials) {
    const absolutePath = resolve(config.googleApplicationCredentials);
    const raw = readFileSync(absolutePath, "utf8");
    return JSON.parse(raw) as ServiceAccount;
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in server/.env.",
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

export function getAdminAuth() {
  return getAuth(getFirebaseApp());
}

export function getBucket() {
  return getStorage(getFirebaseApp()).bucket();
}
