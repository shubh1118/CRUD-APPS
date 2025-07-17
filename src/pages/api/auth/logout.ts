// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { AUTH_TOKEN_NAME } from '../../../utils/config'; // Import the cookie name

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Only allow POST requests for logout
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Clear the authentication cookie by setting its expiry to a past date
  res.setHeader('Set-Cookie', serialize(AUTH_TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure in production
    sameSite: 'strict',
    maxAge: -1, // Set maxAge to -1 to expire the cookie immediately
    path: '/',
  }));

  // Send a success response
  return res.status(200).json({ message: 'Logged out successfully' });
}