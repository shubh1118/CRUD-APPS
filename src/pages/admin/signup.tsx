import React, { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../utils/firebase";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully! You are now logged in.");
      router.push("/admin");
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Email address is already in use.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address format.";
            break;
          case "auth/weak-password":
            errorMessage =
              "Password is too weak. Please use at least 6 characters.";
            break;
          default:
            errorMessage = `Signup error: ${error.message}`;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Admin Panel</title>
        <meta
          name="description"
          content="Admin signup page for the art gallery"
        />
      </Head>
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            Admin Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
                "&:disabled": {
                  boxShadow: "none",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing Up...</span>
                </Box>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <NextLink href="/admin/login" passHref legacyBehavior>
                <MuiLink
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Already have an account? Sign In
                </MuiLink>
              </NextLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
