// src/utils/firebaseAdmin.ts
import * as admin from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables!");
  throw new Error("Firebase Admin SDK service account key is missing.");
}

let serviceAccount: admin.ServiceAccount; // Explicitly type serviceAccount
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
  throw new Error("Invalid Firebase Admin SDK service account key format.");
}

// --- ADD THESE CONSOLE LOGS FOR DEBUGGING ---
console.log("Firebase Admin SDK: Attempting to initialize...");
if (serviceAccount.projectId) { // Check if projectId exists before logging
  console.log("Project ID from service account:", serviceAccount.projectId);
} else {
  console.log("Project ID not found in service account JSON.");
}
// ---------------------------------------------

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // --- ADD THIS CONSOLE LOG ---
  console.log("Firebase Admin SDK initialized successfully.");
  // ----------------------------
} else {
  // --- ADD THIS CONSOLE LOG ---
  console.log("Firebase Admin SDK already initialized.");
  // ----------------------------
}

export { admin };