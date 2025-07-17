
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { admin } from '../../utils/firebaseAdmin';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import NextLink from 'next/link';


import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  CircularProgress,
  CssBaseline,
} from '@mui/material';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';

// Artwork type
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

export default function AdminDashboard() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchArtworks() {
      try {
        setLoading(true);
        const response = await fetch("/api/artworks");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Artwork[] = await response.json();
        setArtworks(data);
      } catch (err: any) {
        toast.error(`Failed to load artworks: ${err.message}`);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArtworks();
  }, []);

  const handleEdit = (artworkId: string) => {
    toast.info(`Edit functionality for artwork ID: ${artworkId} will be implemented.`);
  };

  const handleDelete = async (artworkId: string) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error!`);
      }

      setArtworks(prev => prev.filter(art => art.id !== artworkId));
      toast.success("Artwork deleted!");
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleAddNew = () => {
    toast.info("Add New functionality will be implemented.");
  };

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Admin Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxWidth="lg" sx={{ mt: 0, mb: 4, fontFamily: 'Inter, sans-serif', backgroundColor: '#F5F5F7', minHeight: '100vh', pt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={3}>
          <Typography variant="h4" fontWeight={600} color="#1D1D1F" sx={{ mt: 0 }}>
            Admin Dashboard - Artworks
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#007AFF', borderRadius: '10px', textTransform: 'none' }}
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add New Artwork
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '60vh' }}>
            <CircularProgress />
            <Typography variant="h6" ml={2}>Loading Artworks...</Typography>
          </Box>
        ) : error ? (
          <Box textAlign="center">
            <Typography variant="h6" color="error">Error loading artworks</Typography>
            <Typography>{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Box>
        ) : artworks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <Typography variant="h6">No artworks found.</Typography>
            <Typography variant="body2">Click “Add New Artwork” to get started.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="artworks table">
              <TableHead sx={{ backgroundColor: '#E5E5EA' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Artist</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {artworks.map((artwork) => (
                  <TableRow
                    key={artwork.id}
                    hover
                    sx={{
                      transition: 'background 0.3s ease',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <TableCell>{artwork.title}</TableCell>
                    <TableCell>{artwork.artist_name}</TableCell>
                    <TableCell>{new Date(artwork.painting_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(artwork.id)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(artwork.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <NextLink href="/" passHref legacyBehavior>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: '50px',
                px: 3,
                py: 1,
                fontWeight: 500,
                textTransform: 'none'
              }}
            >
              Back to Homepage
            </Button>
          </NextLink>
        </Box>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parseCookies(context);
    const firebaseIdToken = cookies.__session;

    if (!firebaseIdToken) {
      return {
        redirect: { destination: '/admin/login', permanent: false },
      };
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    console.log('Verified:', decodedToken.uid);

    return { props: {} };
  } catch (error: any) {
    console.error('Auth error:', error);
    destroyCookie(context, '__session', { path: '/' });
    return {
      redirect: { destination: '/admin/login', permanent: false },
    };
  }
};
