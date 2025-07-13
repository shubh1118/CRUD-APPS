import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/myCard.module.css";

type ArtworkProps = {
  id: string;
  image_url: string;
  title: string;
  artist_name: string;
  painting_date: string;
};

const myCard: React.FC<ArtworkProps> = ({
  id,
  image_url,
  title,
  artist_name,
  painting_date,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image_url}
          alt={title}
          fill
          style={{ objectFit: "cover", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
        />
      </div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>Artist: {artist_name}</p>
        <p>Painted: {painting_date}</p>
      </div>
      <div className={styles.actions}>
        <Link href={`/art/${id}`} className={styles.viewButton}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default myCard;
