// utils/auth.ts
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config'; // Make sure JWT_SECRET is imported from your config

interface DecodedToken {
  username: string;
  role: string;
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
}

/**
 * Verifies a JWT token.
 * @param token The JWT string.
 * @returns Decoded token payload if valid, null otherwise.
 */
export function verifyToken(token: string): DecodedToken | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    // Optional: Add more validation here if needed (e.g., check 'role')
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', (error as Error).message);
    return null;
  }
}