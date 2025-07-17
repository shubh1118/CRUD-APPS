import React, { useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Container,
  Grid,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";

import MyCard from "@/components/myCard"; 
import { useRouter } from "next/router";

type Artwork = {
  id: string;
  image_url: string;
  title: string;
  artist_name: string;
  painting_date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [artistFilter, setArtistFilter] = useState<string>("");
  const router = useRouter();

  const fetchArtworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/artworks");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Artwork[] = await response.json();
      setArtworks(data);
    } catch (err: any) {
      console.error("Error fetching artworks:", err);
      setError(`Failed to load artworks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleArtistFilterChange = (event: SelectChangeEvent) => {
    setArtistFilter(event.target.value as string);
  };

  const uniqueArtists = Array.from(
    new Set(artworks.map((art) => art.artist_name))
  );

  const filteredArtworks =
    artistFilter === ""
      ? artworks
      : artworks.filter((art) => art.artist_name === artistFilter);

  return (
    <>
      <Head>
        <title>Next Js CRUD Art Gallery</title>
        <meta
          name="description"
          content="Explore a world of beautiful artworks."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Next.js CRUD Art Gallery
        </Typography>

        <Typography variant="body1" sx={{ textAlign: "center", mb: 4 }}>
          Full-stack application with an admin role
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            size="large"
            component={NextLink}
            href="/admin/add-artwork"
            sx={{
              whiteSpace: "nowrap",
              bgcolor: "green",
              "&:hover": {
                bgcolor: "darkgreen",
              },
            }}
          >
            ADD ARTWORK
          </Button>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="artist-select-label">Artist</InputLabel>
            <Select
              labelId="artist-select-label"
              id="artist-select"
              value={artistFilter}
              label="Artist"
              onChange={handleArtistFilterChange}
            >
              <MenuItem value="">
                <em>All Artists</em>
              </MenuItem>
              {uniqueArtists.map((artist) => (
                <MenuItem key={artist} value={artist}>
                  {artist}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        
        {loading ? ( // <-- Add parenthesis around the JSX block for the true case
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading artworks...</Typography>
          </Box>
        ) : error ? ( // <-- Now this ')' correctly closes the previous block, and '?' starts the next condition
          <Typography
            variant="h6"
            color="error"
            sx={{ textAlign: "center", mt: 4 }}
          >
            {error}
          </Typography>
        ) : filteredArtworks.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            {artistFilter
              ? `No artworks found for artist "${artistFilter}".`
              : "No artworks available. Add some from the Admin panel!"}
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredArtworks.map((art) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={art.id} sx={{ display: 'flex' }}>
                <MyCard {...art} id={art.id} />
              </Grid>
            ))}
          </Grid>
        )}
        
      </Container>
    </>
  );
}