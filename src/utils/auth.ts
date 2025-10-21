import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

interface DecodedToken {
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export function verifyToken(token: string): DecodedToken | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", (error as Error).message);
    return null;
  }
}
