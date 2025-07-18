import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

type ArtworkProps = {
  id: string;
  image_url: string;
  title: string;
  artist_name: string;
  painting_date: string;
};

const MyMuiCard: React.FC<ArtworkProps> = ({
  id,
  image_url,
  title,
  artist_name,
  painting_date,
}) => {
  return (
    <Card
      sx={{
        width: 300,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter, sans-serif",
      }}
    >
     
      <Box sx={{ position: "relative", height: 180 }}>
        <Image
          src={image_url}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>

     
      <CardContent sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1D1D1F">
          {title}
        </Typography>
        <Typography variant="body2" color="#6e6e73">
          Artist: {artist_name}
        </Typography>
        <Typography variant="body2" color="#6e6e73">
          Painted: {painting_date}
        </Typography>
      </CardContent>

    
      <Box sx={{ textAlign: "center", pb: 2, pt: 1 }}>
        <Link href={`/art/${id}`} passHref legacyBehavior>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "0.875rem", 
              px: 3,
              py: 1,
              borderRadius: "8px",
              fontWeight: 500,
              "&:hover": {
              
                color: "#000",
              },
            }}
          >
            View Details
          </Button>
        </Link>
      </Box>
    </Card>
  );
};

export default MyMuiCard;
