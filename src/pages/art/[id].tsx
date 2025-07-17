import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
  CssBaseline,
} from "@mui/material";

type Artwork = {
  id: string;
  title: string;
  artist_name: string;
  painting_date: string;
  image_url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ArtworkDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchArtwork = async () => {
        try {
          const res = await fetch(`/api/artworks/${id}`);
          if (!res.ok) throw new Error(res.status === 404 ? "Artwork not found." : "Failed to fetch artwork.");
          const data: Artwork = await res.json();
          setArtwork(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchArtwork();
    } else {
      setLoading(false);
      setError("Invalid artwork ID.");
    }
  }, [id]);

  return (
    <>
      <CssBaseline />
      <Head>
        <title>{artwork?.title || "Artwork"} - Art Gallery</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container
        maxWidth="md"
        sx={{
          py: 6,
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#F5F5F7",
          minHeight: "100vh",
        }}
      >
        {loading ? (
          <Box textAlign="center" py={10}>
            <CircularProgress />
            <Typography mt={2}>Loading artwork details...</Typography>
          </Box>
        ) : error ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
            <Typography variant="h5" color="error" gutterBottom>Error</Typography>
            <Typography variant="body1" gutterBottom>{error}</Typography>
            <Button
              variant="outlined"
              href="/"
              sx={{
                mt: 2,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#FFCC00",
                  color: "#000",
                },
              }}
            >
              ← Back to Homepage
            </Button>
          </Paper>
        ) : artwork ? (
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: "#fff" }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>{artwork.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>by {artwork.artist_name}</Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 2",
                borderRadius: "12px",
                overflow: "hidden",
                mb: 4,
              }}
            >
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="#6e6e73">Painting Date</Typography>
                <Typography variant="body1" color="#1D1D1F">{artwork.painting_date}</Typography>
              </Box>
              {artwork.description && (
                <Box mb={2}>
                  <Typography variant="subtitle2" fontWeight={600} color="#6e6e73">Description</Typography>
                  <Typography variant="body1" color="#1D1D1F">{artwork.description}</Typography>
                </Box>
              )}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="#6e6e73">Added On</Typography>
                <Typography variant="body1" color="#1D1D1F">{new Date(artwork.createdAt).toLocaleDateString()}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="#6e6e73">Last Updated</Typography>
                <Typography variant="body1" color="#1D1D1F">{new Date(artwork.updatedAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                href="/"
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#FFCC00",
                    color: "#000",
                  },
                }}
              >
                ← Back to Homepage
              </Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="h6">Artwork not found.</Typography>
        )}
      </Container>
    </>
  );
}
