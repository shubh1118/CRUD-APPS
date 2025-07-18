// src/pages/admin/edit-artwork/[artworkId].tsx

import React, { useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from 'react-hot-toast';

// Cloudinary Imports
import { CldUploadWidget } from 'next-cloudinary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // For a nice upload icon
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // Icon for AI generation

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
import EditNoteIcon from '@mui/icons-material/EditNote'; // Icon for "Edit"

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';

import { GetServerSideProps } from 'next';
import { admin } from '../../../utils/firebaseAdmin';
import { parseCookies, destroyCookie } from 'nookies';

// IMPORTANT: Updated Artwork type to include ai_review
type Artwork = {
  id: string;
  title: string;
  artist_name: string;
  painting_date: string; // YYYY-MM-DD format
  image_url: string;
  description?: string;
  ai_review?: string; // Added ai_review field for storing AI-generated review
  createdAt: string;
  updatedAt: string;
};

// Data structure for the form (without id, createdAt, updatedAt)
type ArtworkFormData = Omit<Artwork, "id" | "createdAt" | "updatedAt">;

// Type for form validation errors
type FormErrors = {
  title?: string;
  artist_name?: string;
  painting_date?: string;
  image_url?: string;
  description?: string;
  // No error for ai_review as it's AI-generated
};

export default function EditArtworkPage() {
  const router = useRouter();
  const { artworkId } = router.query;
  const [formData, setFormData] = useState<ArtworkFormData>({
    title: '',
    artist_name: '',
    painting_date: '',
    image_url: '',
    description: '',
    ai_review: '', // Initialize ai_review
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // New state for AI review generation
  const [isGeneratingReview, setIsGeneratingReview] = useState<boolean>(false);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);

  // --- Effect to Fetch Artwork Data on Component Mount ---
  useEffect(() => {
    if (artworkId && typeof artworkId === "string") {
      const fetchArtwork = async () => {
        try {
          setLoading(true);
          setFetchError(null);

          const response = await fetch(`/api/artworks/${artworkId}`);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Artwork not found.");
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch artwork (Status: ${response.status}).`);
          }

          const data: Artwork = await response.json();
          setFormData({
            title: data.title,
            artist_name: data.artist_name,
            painting_date: data.painting_date,
            image_url: data.image_url,
            description: data.description || '',
            ai_review: data.ai_review || '', // Set ai_review from fetched data
          });
          toast.success("Artwork details loaded for editing!");
        } catch (err: any) {
          console.error("Error fetching artwork for edit:", err);
          setFetchError(err.message);
          toast.error(`Error loading artwork: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchArtwork();
    } else if (!artworkId) {
      setLoading(false);
      setFetchError("No artwork ID provided for editing.");
      toast.error("No artwork ID provided in the URL.");
    }
  }, [artworkId]);

  // --- Cloudinary Upload Specific Function ---
  const handleUploadSuccess = (result: any, widget: any) => {
    if (result.event === 'success') {
      const uploadedImageUrl = result.info.secure_url;
      setFormData(prevData => ({
        ...prevData,
        image_url: uploadedImageUrl, // Set the Cloudinary URL here
      }));
      toast.success("Image uploaded successfully to Cloudinary!");

      // Clear image_url error if it was present
      if (errors.image_url) {
        setErrors(prevErrors => ({ ...prevErrors, image_url: undefined }));
      }

      widget.close(); // Close the widget after successful upload
    }
  };

  // --- AI Review Generation Function ---
  const handleGenerateAIReview = async () => {
    if (!formData.image_url) {
      toast.error("Please upload an image first to generate an AI review.");
      return;
    }

    setIsGeneratingReview(true);
    setAiReviewError(null);
    toast.loading("Generating AI review...", { id: 'aiReviewGen' });

    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: formData.image_url,
          title: formData.title,
          artist_name: formData.artist_name,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate AI review');
      }

      const { review } = await response.json();
      setFormData(prevData => ({ ...prevData, ai_review: review }));
      toast.success("AI review generated successfully!", { id: 'aiReviewGen' });
    } catch (error: any) {
      console.error("Error generating AI review:", error);
      setAiReviewError(error.message);
      toast.error(`Failed to generate AI review: ${error.message}`, { id: 'aiReviewGen' });
    } finally {
      setIsGeneratingReview(false);
    }
  };

  // --- Form Field Change Handler ---
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

  // --- Date Picker Change Handler ---
  const handleDateChange = (date: Date | null) => {
    const formattedDate = date && !isNaN(date.getTime()) ? format(date, 'yyyy-MM-dd') : '';
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

  // --- Form Validation Logic ---
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist_name.trim()) newErrors.artist_name = 'Artist name is required';

    if (!formData.painting_date.trim()) {
      newErrors.painting_date = 'Painting date is required';
    }

    // Validation for image_url is simplified now as Cloudinary provides valid URLs
    if (!formData.image_url.trim()) newErrors.image_url = 'Image URL is required (please upload an image)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please correct the errors in the form before saving.");
      return;
    }

    if (!artworkId || typeof artworkId !== "string") {
        toast.error("Artwork ID is missing for the update operation.");
        return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update artwork');
      }

      toast.success('Artwork updated successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Error updating artwork:', err);
      toast.error(`Error updating artwork: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

 
  if (loading) {
    return (
      <Container sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
          <Typography variant="h6" ml={2}>Loading artwork details...</Typography>
        </Box>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 6, fontFamily: "Inter, sans-serif" }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>Error</Typography>
          <Typography variant="body1" gutterBottom>{fetchError}</Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin")}
            sx={{ mt: 2, textTransform: "none", borderRadius: "8px" }}
          >
            ← Back to Admin Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Edit Artwork: {formData.title || artworkId}</title>
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
          <EditNoteIcon color="primary" sx={{ mr: 1, fontSize: 26 }} />
          <Typography variant="h5" fontWeight={600}>
            Edit Artwork
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
                  value={formData.painting_date ? parseISO(formData.painting_date) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.painting_date}
                      helperText={errors.painting_date}
                    />
                  )}
                />
              </LocalizationProvider>

           
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" sx={{ mt: 1 }}>Artwork Image</Typography>

                  <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string}
                      onSuccess={handleUploadSuccess}
                      options={{
                          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Explicitly pass cloudName
                          sources: ['local', 'url', 'camera'],
                          multiple: false,
                          folder: 'artwork_images',
                          maxFileSize: 10485760, // 10MB limit
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
                          No image uploaded yet. Please click "Upload Image" to add one.
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

              {/* AI Review Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" sx={{ mt: 1 }}>AI Review</Typography>
                  <TextField
                      label="AI Generated Review"
                      name="ai_review"
                      value={formData.ai_review}
                      fullWidth
                      multiline
                      rows={4}
                      InputProps={{
                          readOnly: true, // Make this field read-only
                      }}
                      helperText="Click 'Generate AI Review' to get a critique of the artwork image."
                  />
                  <Button
                      variant="outlined"
                      onClick={handleGenerateAIReview}
                      disabled={!formData.image_url || isGeneratingReview} // Disable if no image or already generating
                      startIcon={isGeneratingReview ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                      sx={{ textTransform: 'none' }}
                  >
                      {isGeneratingReview ? "Generating..." : "Generate AI Review"}
                  </Button>
                  {aiReviewError && (
                      <Typography color="error" variant="body2">
                          {aiReviewError}
                      </Typography>
                  )}
              </Box>
              {/* End AI Review Section */}

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
                  disabled={isSaving}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    // "&:hover": {
                    //   backgroundColor: "#FFCC00",
                    //   color: "#000",
                    // },
                  }}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
}

// --- getServerSideProps for Authentication ---
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parseCookies(context);
    const firebaseIdToken = cookies.__session;

    if (!firebaseIdToken) {
      console.log('Edit Artwork: No Firebase ID token found, redirecting to login.');
      return {
        redirect: { destination: "/admin/login", permanent: false },
      };
    }

    await admin.auth().verifyIdToken(firebaseIdToken);

    return { props: {} };
  } catch (error: any) {
    console.error('Authentication error on edit artwork page (Firebase ID token verification failed):', error);
    destroyCookie(context, "__session", { path: "/" });
    return {
      redirect: { destination: "/admin/login", permanent: false },
    };
  }
};