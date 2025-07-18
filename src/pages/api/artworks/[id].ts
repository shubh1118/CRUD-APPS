// src/pages/api/artworks/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const artwork = await prisma.artwork.findUnique({ where: { id } });
      if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
      res.status(200).json(artwork);
    } catch (error: any) { // Explicitly type error here
      console.error("Error fetching artwork:", error); // More specific log
      res.status(500).json({ message: 'Server error fetching artwork', details: error.message }); // Send error details
    }
  }

  else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // You can log the incoming body here to verify it's clean
      // console.log("Received PUT request body:", req.body);

      const updated = await prisma.artwork.update({ where: { id }, data: req.body });
      res.status(200).json(updated);
    } catch (error: any) { // Explicitly type error here
      console.error("Prisma Error during Artwork PUT/PATCH:", error); // Log the full error
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Artwork not found for update' });
      }
      // Send the actual Prisma error message in development for better debugging
      // In production, you might want a more generic message for security
      res.status(500).json({
        message: 'Failed to update artwork',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.',
        prismaCode: error.code // Include Prisma error code
      });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await prisma.artwork.delete({ where: { id } });
      res.status(204).end();
    } catch (error: any) { // Explicitly type error here
      console.error("Prisma Error during Artwork DELETE:", error); // More specific log
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Artwork not found for deletion' });
      }
      res.status(500).json({ message: 'Failed to delete artwork', details: error.message }); // Send error details
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}