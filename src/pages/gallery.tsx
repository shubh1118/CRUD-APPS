import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Correct import for Grid2
import MyCard from "@/components/myCard";

const artworks = [
  {
    id: "gal1",
    image_url: "https://source.unsplash.com/random/400x300?sig=10",
    title: "Ocean Whispers",
    artist_name: "Aanya Rao",
    painting_date: "March 2021",
  },
  {
    id: "gal2",
    image_url: "https://source.unsplash.com/random/400x300?sig=11",
    title: "Sunset Glory",
    artist_name: "Ravi Kumar",
    painting_date: "Jan 2023",
  },
  {
    id: "gal3",
    image_url: "https://source.unsplash.com/random/400x300?sig=12",
    title: "Abstract Love",
    artist_name: "Sneha Patil",
    painting_date: "Dec 2022",
  },
];

export default function Gallery() {
  return (
    <Grid
      container // The outer Grid is the container
      spacing={3}
      sx={{ padding: 2, maxWidth: "xl", mx: "auto", mt: 4 }}
    >
      {artworks.map((art) => (
        <Grid
          // REMOVE THE 'item' PROP HERE
          xs={12}
          sm={6}
          md={4}
          key={art.id}
          // component="div" // You can remove this unless specifically needed for other reasons
        >
          <MyCard {...art} id={art.id} />
        </Grid>
      ))}
    </Grid>
  );
}