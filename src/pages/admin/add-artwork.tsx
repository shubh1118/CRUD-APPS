// src/pages/admin/add-artwork.tsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/addArtwork.module.css";

// Artwork type
type Artwork = {
  id: string;
  title: string;
  artist_name: string;
  painting_date: string;
  image_url: string;
  description: string;
};

export default function AddArtwork() {
  const router = useRouter();
  const { id } = router.query;

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Omit<Artwork, "id">>({
    title: "",
    artist_name: "",
    painting_date: "",
    image_url: "",
    description: "",
  });

  
  const getStoredArtworks = (): Artwork[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("artworks");
    return stored ? JSON.parse(stored) : [];
  };

  useEffect(() => {
    if (id) {
      const artworks = getStoredArtworks();
      const existing = artworks.find((art) => art.id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          artist_name: existing.artist_name,
          painting_date: existing.painting_date,
          image_url: existing.image_url,
          description: existing.description,
        });
        setIsEditMode(true);
      } else {
        alert("Artwork not found!");
        router.push("/admin");
      }
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artworks = getStoredArtworks();

    if (isEditMode && id) {
      const updatedArtworks = artworks.map((art) =>
        art.id === id ? { ...art, ...formData, id: id as string } : art
      );
      localStorage.setItem("artworks", JSON.stringify(updatedArtworks));
      alert("Artwork updated!");
    } else {
      const newId = `art${Date.now()}`;
      const newArtwork: Artwork = { ...formData, id: newId };
      artworks.push(newArtwork);
      localStorage.setItem("artworks", JSON.stringify(artworks));
      alert("New artwork added!");
    }

    router.push("/admin");
  };

  return (
    <>
      <Head>
        <title>{isEditMode ? "Edit Artwork" : "Add New Artwork"} - Admin</title>
        <meta name="description" content="Add or Edit an artwork in the gallery" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.heading}>
          {isEditMode ? "Edit Artwork" : "Add New Artwork"}
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Artwork Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="artist_name"
            placeholder="Artist Name"
            value={formData.artist_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="painting_date"
            placeholder="Painting Date (e.g. Jan 2024)"
            value={formData.painting_date}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Artwork Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <button type="submit">
            {isEditMode ? "Update Artwork" : "Add Artwork"}
          </button>
        </form>

        <Link href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>
    </>
  );
}
