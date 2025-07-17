
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const artworks = await prisma.artwork.findMany();
      res.status(200).json(artworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      res.status(500).json({ message: 'Failed to fetch artworks.' });
    }
  } else if (req.method === 'POST') {
    try {
      const newArtwork = await prisma.artwork.create({
        data: req.body,
      });
      res.status(201).json(newArtwork);
    } catch (error) {
      console.error("Error creating artwork:", error);
      res.status(500).json({ message: 'Failed to create artwork.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
