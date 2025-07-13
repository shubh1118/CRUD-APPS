import React from "react";
import { useRouter } from "next/router"; // For dynamic routing
import Head from "next/head";
import Image from "next/image";

import { Box, Typography, Button, Container } from "@mui/material";
import NextLink from "next/link";

const dummyArtworks = [
  {
    id: "art1",
    image_url: "https://source.unsplash.com/random/800x600?sig=1",
    title: "Mountain Light",
    artist_name: "Amit Verma",
    painting_date: "Feb 2022",
    description:
      "A breathtaking landscape painting capturing the serene light of mountains at dawn. The artist used warm and cool tones to convey depth and atmosphere.",
  },
  {
    id: "art2",
    image_url: "https://source.unsplash.com/random/800x600?sig=2",
    title: "Mystic River",
    artist_name: "Sneha Patil",
    painting_date: "Jan 2023",
    description:
      "An ethereal depiction of a river flowing through an enchanted forest, shrouded in mist. The artwork evokes a sense of mystery and tranquility.",
  },
  {
    id: "art3",
    image_url: "https://source.unsplash.com/random/800x600?sig=3",
    title: "Urban Night",
    artist_name: "Rohit Jain",
    painting_date: "March 2024",
    description:
      "A vibrant city skyline at night, illuminated by the glow of streetlights and distant buildings. Captures the dynamic energy of urban life.",
  },
  {
    id: "art4",
    image_url: "https://source.unsplash.com/random/800x600?sig=4",
    title: "Forest Hues",
    artist_name: "Priya Sharma",
    painting_date: "July 2023",
    description:
      "A colorful abstract piece exploring the various shades and textures found within a deep forest. Uses bold strokes and a rich palette.",
  },
  {
    id: "art5",
    image_url: "https://source.unsplash.com/random/800x600?sig=5",
    title: "Desert Bloom",
    artist_name: "Karan Singh",
    painting_date: "April 2022",
    description:
      "A striking portrayal of life emerging in the harsh desert environment, with vibrant flowers blooming against a stark backdrop. Symbolizes resilience.",
  },
  {
    id: "art6",
    image_url: "https://source.unsplash.com/random/800x600?sig=6",
    title: "Ocean Echoes",
    artist_name: "Deepak Kumar",
    painting_date: "Nov 2023",
    description:
      "A mesmerizing artwork capturing the sounds and vastness of the ocean, with waves crashing against rocks and the distant horizon. Evokes a sense of peace and power.",
  },
];

export default function ArtworkDetailPage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL

  // Find the artwork based on the ID
  const artwork = dummyArtworks.find((art) => art.id === id);

  // Show a loading state or redirect if ID is not available yet or artwork not found
  if (!artwork) {
    // router.isFallback is true during static generation when a dynamic page
    // hasn't been generated yet (only relevant with getStaticPaths + fallback: true)
    // For client-side rendering, this simply means the ID isn't ready yet or not found.
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" color="text.secondary">
          {id ? "Artwork not found." : "Loading artwork details..."}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" component={NextLink} href="/">
            Go to Homepage
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>{artwork.title} - Art Gallery</title>
        <meta
          name="description"
          content={`Details of ${artwork.title} by ${artwork.artist_name}`}
        />
      </Head>

      <Container maxWidth="md" sx={{ mt: 8, mb: 4, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Artwork Image */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              minHeight: { xs: 300, md: 400 },
              width: "100%",
            }}
          >
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              layout="fill"
              objectFit="contain" // Use 'contain' to ensure full image is visible
              priority // Load this image with high priority
              sizes="(max-width: 900px) 100vw, 50vw" // Adjust based on layout
              style={{ borderRadius: "8px" }}
            />
          </Box>

          {/* Artwork Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {artwork.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Artist: {artwork.artist_name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Painted: {artwork.painting_date}
            </Typography>
            <Typography variant="body1" paragraph>
              {artwork.description}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" component={NextLink} href="/">
                Back to Gallery
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
