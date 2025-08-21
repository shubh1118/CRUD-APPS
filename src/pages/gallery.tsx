import React from "react";
import MyCard, { ArtworkProps } from "../components/myCard";
import { Box } from "@mui/material";

const artworks: ArtworkProps[] = [
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
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        px: 2,
        mt: 4,
        maxWidth: "xl",
        mx: "auto",
      }}
    >
      {artworks.map((art) => (
        <MyCard key={art.id} {...art} />
      ))}
    </Box>
  );
}
