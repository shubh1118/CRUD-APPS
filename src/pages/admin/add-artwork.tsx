import React, { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from 'react-hot-toast'; 

import { CldUploadWidget } from 'next-cloudinary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
  Stack,
  CssBaseline,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

import { GetServerSideProps } from 'next';
import { admin } from '../../utils/firebaseAdmin';
import { parseCookies, destroyCookie } from 'nookies';


type Artwork = {
  id: string;
  title: string;
  artist_name: string;
  painting_date: string;
  image_url: string;
  description?: string;
  ai_review?: string; 
  createdAt: string;
  updatedAt: string;
};


type ArtworkFormData = Omit<Artwork, "id" | "createdAt" | "updatedAt">;

type FormErrors = {
  title?: string;
  artist_name?: string;
  painting_date?: string;
  image_url?: string;
  description?: string;

};

export default function AddArtwork() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArtworkFormData>({
    title: '',
    artist_name: '',
    painting_date: '',
    image_url: '', 
    description: '',
    ai_review: '', 
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  

  const handleUploadSuccess = (result: any, widget: any) => {
    if (result.event === 'success') {
      const uploadedImageUrl = result.info.secure_url;
      setFormData(prevData => ({
        ...prevData,
        image_url: uploadedImageUrl, 
      }));
      toast.success("Image uploaded successfully to Cloudinary!");

   
      if (errors.image_url) {
        setErrors(prevErrors => ({ ...prevErrors, image_url: undefined }));
      }

      widget.close(); 
    }
  };
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFormData((prevData) => ({
      ...prevData,
      painting_date: formattedDate,
    }));

    if (errors.painting_date) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        painting_date: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist_name.trim()) newErrors.artist_name = 'Artist name is required';

    if (!formData.painting_date.trim()) {
      newErrors.painting_date = 'Painting date is required';
    }

   
    if (!formData.image_url.trim()) newErrors.image_url = 'Image URL is required (please upload an image)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form before saving.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add artwork');
      }

      toast.success('Artwork added successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Error adding artwork:', err);
      toast.error(`Error adding artwork: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Add New Artwork</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          mb: 6,
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#F5F5F7",
          borderRadius: 2,
          py: 4
        }}
      >

        <Box display="flex" alignItems="center" mb={3}>
          <AddCircleOutlineIcon color="primary" sx={{ mr: 1, fontSize: 26 }} />
          <Typography variant="h5" fontWeight={600}>
            Add New Artwork
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
              />
              <TextField
                label="Artist Name"
                name="artist_name"
                value={formData.artist_name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.artist_name}
                helperText={errors.artist_name}
              />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Painting Date"
    value={formData.painting_date ? new Date(formData.painting_date) : null}
    onChange={handleDateChange}
    slotProps={{
      textField: {
        fullWidth: true,
        variant: 'outlined'
      }
    }}
  />
</LocalizationProvider>

            
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" sx={{ mt: 1 }}>Artwork Image</Typography>

                  <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string} 
                      onSuccess={handleUploadSuccess}
                      options={{
                          sources: ['local', 'url', 'camera'], 
                          multiple: false, 
                          folder: 'artwork_images', 
                          maxFileSize: 10485760, 
                          clientAllowedFormats: ["png", "gif", "jpeg", "jpg", "webp", "svg"], 
                      }}
                  >
                      {({ open }) => {
                          return (
                              <Button
                                  variant="contained"
                                  onClick={() => open()} 
                                  startIcon={<CloudUploadIcon />}
                                  
                                  color={!!errors.image_url ? 'error' : 'primary'} 
                              >
                                  {formData.image_url ? "Change Image" : "Upload Image"}
                              </Button>
                          );
                      }}
                  </CldUploadWidget>

                  {/* Display image_url validation error */}
                  {!!errors.image_url && (
                      <Typography color="error" variant="body2">
                          {errors.image_url}
                      </Typography>
                  )}

                  {/* Display uploaded image preview */}
                  {formData.image_url ? (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle1" gutterBottom>Current Image Preview:</Typography>
                          <img
                              src={formData.image_url}
                              alt="Artwork Preview"
                              style={{
                                  maxWidth: '100%',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  border: '1px solid #ddd',
                                  borderRadius: '8px'
                              }}
                          />
                          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1, wordBreak: 'break-all' }}>
                              URL: {formData.image_url}
                          </Typography>
                      </Box>
                  ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          No image uploaded yet. Please click "Upload Image".
                      </Typography>
                  )}
              </Box>
              {/* End Cloudinary Upload Widget Section */}

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ pt: 1 }}
              >
                <NextLink href="/admin" passHref legacyBehavior>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    Back
                  </Button>
                </NextLink>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    // Current theme for primary button - keep consistent or adjust
                    // "&:hover": {
                    //   backgroundColor: "#FFCC00",
                    //   color: "#000",
                    // },
                  }}
                >
                  {loading ? "Saving..." : "Add Artwork"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parseCookies(context);
    const token = cookies.__session;

    if (!token) {
      console.log('Add Artwork: No Firebase ID token found, redirecting to login.');
      return {
        redirect: { destination: "/admin/login", permanent: false },
      };
    }

    await admin.auth().verifyIdToken(token);

    return { props: {} };
  } catch (error: any) {
    console.error('Authentication error on add artwork page (Firebase ID token verification failed):', error);

    destroyCookie(context, "__session", { path: "/" });
    return {
      redirect: { destination: "/admin/login", permanent: false },
    };
  }
};