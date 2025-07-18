// src/utils/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import path from 'path'; // Add this line
import fs from 'fs';   // Add this line

// Get the service account file path from environment variables
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

// Temporary console log for debugging the environment variable loading
console.log("FIREBASE_SERVICE_ACCOUNT_PATH value (at file load):", serviceAccountPath ? `Loaded: ${serviceAccountPath}` : "UNDEFINED/EMPTY");

// Check if the service account key path is missing
if (!serviceAccountPath) {
  console.error("FIREBASE_SERVICE_ACCOUNT_PATH is not set in environment variables!");
  throw new Error("Firebase Admin SDK service account file path is missing.");
}

// Resolve the absolute path to the service account file
const absoluteServiceAccountPath = path.resolve(process.cwd(), serviceAccountPath);

let serviceAccount: admin.ServiceAccount;
try {
  // Read the JSON file content and parse it
  const fileContent = fs.readFileSync(absoluteServiceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent);
  console.log(`Successfully loaded Firebase service account from ${absoluteServiceAccountPath}`);
} catch (e) {
  console.error(`Failed to load or parse Firebase service account key from ${absoluteServiceAccountPath}:`, e);
  throw new Error("Invalid Firebase Admin SDK service account file or format. Please ensure the path is correct and the file contains valid JSON.");
}

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  console.log("Firebase Admin SDK: Attempting to initialize...");
  if (serviceAccount.projectId) {
    console.log("Project ID from service account:", serviceAccount.projectId);
  } else {
    console.log("Project ID not found in service account JSON. This might be an issue with the key.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // If you are using Firebase Realtime Database, uncomment and set this:
    // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
  console.log("Firebase Admin SDK initialized successfully.");
} else {
  console.log("Firebase Admin SDK already initialized. Skipping re-initialization.");
}

// Export the Firestore and Auth instances for use in API routes
const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };