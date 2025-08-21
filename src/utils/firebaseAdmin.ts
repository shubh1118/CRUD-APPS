// src/utils/firebaseAdmin.ts
import * as admin from "firebase-admin";
import path from "path";
import fs from "fs";

// Check for the environment variable with the full JSON content (for Vercel)
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

let serviceAccount: admin.ServiceAccount;

if (serviceAccountJson) {
  // If the full JSON is available (Vercel), parse it directly
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
    console.log(
      "Successfully loaded Firebase service account from environment variable."
    );
  } catch (e) {
    console.error(
      "Failed to parse Firebase service account JSON from environment variable:",
      e
    );
    throw new Error(
      "Invalid Firebase Admin SDK service account JSON. Please ensure the environment variable contains valid JSON."
    );
  }
} else {
  // If not (local), load from the file path
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    console.error(
      "FIREBASE_SERVICE_ACCOUNT_PATH is not set in environment variables!"
    );
    throw new Error("Firebase Admin SDK service account file path is missing.");
  }

  const absoluteServiceAccountPath = path.resolve(
    process.cwd(),
    serviceAccountPath
  );
  try {
    const fileContent = fs.readFileSync(absoluteServiceAccountPath, "utf8");
    serviceAccount = JSON.parse(fileContent);
    console.log(
      `Successfully loaded Firebase service account from ${absoluteServiceAccountPath}`
    );
  } catch (e) {
    console.error(
      `Failed to load Firebase service account key from ${absoluteServiceAccountPath}:`,
      e
    );
    throw new Error(
      "Invalid Firebase Admin SDK service account file or format. Please ensure the path is correct and the file contains valid JSON."
    );
  }
}

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} else {
  console.log(
    "Firebase Admin SDK already initialized. Skipping re-initialization."
  );
}

// Export the Firestore and Auth instances
const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
