import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MyCard from "@/components/myCard"; // Ensure this component exists

export const dummyArtworks = [
  {
    id: "art1",
    image_url: "/images/image-one.jpg",
    title: "Mountain Light",
    artist_name: "Amit Verma",
    painting_date: "Feb 2022",
  },
  {
    id: "art2",
    image_url: "/images/image-two.jpg",
    title: "Mystic River",
    artist_name: "Sneha Patil",
    painting_date: "Jan 2023",
  },
  {
    id: "art3",
    image_url:"/images/image-three.jpg",
    title: "Urban Night",
    artist_name: "Rohit Jain",
    painting_date: "March 2024",
  },
  {
    id: "art4",
    image_url: "/images/image-four.jpg",
    title: "Forest Hues",
    artist_name: "Priya Sharma",
    painting_date: "July 2023",
  },
  {
    id: "art5",
    image_url: "/images/image-five.jpg",
    title: "Desert Bloom",
    artist_name: "Karan Singh",
    painting_date: "April 2022",
  },
  {
    id: "art6",
    image_url: "/images/image-six.jpg",
    title: "Ocean Echoes",
    artist_name: "Deepak Kumar",
    painting_date: "Nov 2023",
  },
];

export default function Home() {
  const [artistFilter, setArtistFilter] = React.useState("");

  const handleArtistFilterChange = (event: SelectChangeEvent) => {
    setArtistFilter(event.target.value as string);
  };

  const uniqueArtists = Array.from(
    new Set(dummyArtworks.map((art) => art.artist_name))
  );

  const filteredArtworks =
    artistFilter === ""
      ? dummyArtworks
      : dummyArtworks.filter((art) => art.artist_name === artistFilter);

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

        <Grid container spacing={3} justifyContent="center">
          {filteredArtworks.map((art) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={art.id}>
              <MyCard {...art} id={art.id} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
