import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/admin.module.css";
import { dummyArtworks } from "@/pages/index"; // Make sure this is exported

export default function AdminDashboard() {
  const [artworks, setArtworks] = useState(dummyArtworks);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(`Delete artwork ID: ${id}?`);
    if (confirmDelete) {
      setArtworks((prev) => prev.filter((art) => art.id !== id));
      alert("Artwork deleted (frontend only)");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Manage artworks in the gallery" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <p className={styles.subheading}>
          Here you can manage all the artworks in your gallery.
        </p>

        <Link href="/admin/add-artwork" className={styles.addButton}>
          Add New Artwork
        </Link>

        <div className={styles.artworkSection}>
          <h2 className={styles.artworkTitle}>Artwork List</h2>

          {artworks.length === 0 ? (
            <p className={styles.artworkNote}>No artworks available.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((art) => (
                  <tr key={art.id}>
                    <td>{art.title}</td>
                    <td>{art.artist_name}</td>
                    <td>{art.painting_date}</td>
                    <td>
                      <Link
                        href={`/admin/add-artwork?id=${art.id}`}
                        className={styles.editButton}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Link href="/" className={styles.backButton}>
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
