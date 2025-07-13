// src/pages/gallery.tsx - FINAL CORRECTED CODE

import React from "react"; // Add this import for consistency
import Grid from "@mui/material/Grid";
import MyCard from "@/components/myCard"; // Consistent casing MyCard

const artworks = [
  {
    id: "gal1", // <-- Add unique IDs
    image_url: "https://source.unsplash.com/random/400x300?sig=10",
    title: "Ocean Whispers",
    artist_name: "Aanya Rao",
    painting_date: "March 2021",
  },
  {
    id: "gal2", // <-- Add unique IDs
    image_url: "https://source.unsplash.com/random/400x300?sig=11",
    title: "Sunset Glory",
    artist_name: "Ravi Kumar",
    painting_date: "Jan 2023",
  },
  {
    id: "gal3", // <-- Add unique IDs
    image_url: "https://source.unsplash.com/random/400x300?sig=12",
    title: "Abstract Love",
    artist_name: "Sneha Patil",
    painting_date: "Dec 2022",
  },
];

export default function Gallery() {
  return (
    // You might want to add Head and Navbar here too, similar to index.tsx if this is a full page
    // Or, if this is just a content section to be imported elsewhere, then it's fine as is.
    // Assuming it's a full page, you'd structure it like index.tsx
    <>
      {/* If Navbar is in _app.tsx, it will appear here automatically */}
      <Grid
        container
        spacing={3}
        sx={{ padding: 2, maxWidth: "xl", mx: "auto", mt: 4 }}
      >
        {artworks.map(
          (
            art // Use art.id as key
          ) => (
            <Grid item xs={12} sm={6} md={4} key={art.id}>
              <MyCard {...art} id={art.id} /> {/* <-- Pass id prop */}
            </Grid>
          )
        )}
      </Grid>
    </>
  );
}
