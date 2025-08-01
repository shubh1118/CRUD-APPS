// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET, AUTH_TOKEN_NAME } from '../../../utils/config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // In a real application, you would hash passwords and check against a database
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    try {
      const token = jwt.sign(
        { username: ADMIN_USERNAME, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Set the cookie
      res.setHeader('Set-Cookie', serialize(AUTH_TOKEN_NAME, token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV !== 'development', // Use secure in production (HTTPS)
        sameSite: 'strict', // Protects against CSRF attacks
        maxAge: 60 * 60, // 1 hour (in seconds)
        path: '/', // The cookie is valid for all paths
      }));

      // *** THIS IS THE ADJUSTMENT: Return the token in the response ***
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('JWT Sign Error:', error);
      return res.status(500).json({ message: 'Internal server error during token generation' });
    }
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
}