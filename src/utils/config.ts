// utils/config.ts

// --- Admin Credentials (for development/demo purposes) ---
// In a real application, these would come from environment variables
// and passwords would be hashed and stored securely (e.g., in a database).
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"; // Default for local dev
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpassword"; // Default for local dev (CHANGE THIS!)

// --- JWT Secret Key ---
// This should be a long, random, and complex string.
// **CRITICAL: Generate a strong, unique secret for production!**
// You can generate one with: require('crypto').randomBytes(64).toString('hex') in Node.js console
export const JWT_SECRET = process.env.JWT_SECRET || "your-very-strong-jwt-secret-key-please-change-this-in-production-!!!!";

// --- Authentication Token Cookie Name ---
export const AUTH_TOKEN_NAME = "auth_token";