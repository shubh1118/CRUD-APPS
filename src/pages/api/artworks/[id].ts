import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (req.method === "GET") {
    try {
      const artwork = await prisma.artwork.findUnique({ where: { id } });
      if (!artwork)
        return res.status(404).json({ message: "Artwork not found" });
      res.status(200).json(artwork);
    } catch (error: any) {
      console.error("Error fetching artwork:", error);
      res
        .status(500)
        .json({
          message: "Server error fetching artwork",
          details: error.message,
        });
    }
  } else if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const updated = await prisma.artwork.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(updated);
    } catch (error: any) {
      console.error("Prisma Error during Artwork PUT/PATCH:", error);
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ message: "Artwork not found for update" });
      }
      res.status(500).json({
        message: "Failed to update artwork",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred.",
        prismaCode: error.code,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.artwork.delete({ where: { id } });
      res.status(204).end();
    } catch (error: any) {
      console.error("Prisma Error during Artwork DELETE:", error);
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ message: "Artwork not found for deletion" });
      }
      res
        .status(500)
        .json({ message: "Failed to delete artwork", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
