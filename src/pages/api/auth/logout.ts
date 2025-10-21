import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { AUTH_TOKEN_NAME } from "../../../utils/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  res.setHeader(
    "Set-Cookie",
    serialize(AUTH_TOKEN_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    })
  );

  return res.status(200).json({ message: "Logged out successfully" });
}
