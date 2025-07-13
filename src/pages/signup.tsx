// src/pages/signup.tsx

import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

// Optional: Dummy Icon Components
const GoogleIcon = () => <span>🟦</span>;
const FacebookIcon = () => <span>🟦</span>;
const SitemarkIcon = () => <Typography variant="h6">🎨</Typography>;

// Custom Card Styling
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

// Background Container Styling
const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(ellipse at center, #f0f0f0, #ffffff)",
}));

// Theme Setup
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
});

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
    alert("Sign up successful!");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignUpContainer direction="column">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography variant="h4" component="h1" textAlign="center">
            Sign up
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Jon Snow"
                fullWidth
                required
                error={nameError}
                helperText={nameErrorMessage}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                fullWidth
                required
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                fullWidth
                required
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox name="updates" />}
              label="I want to receive updates via email."
            />

            <Button type="submit" variant="contained" fullWidth>
              Sign up
            </Button>
          </Box>

          <Divider>
            <Typography color="text.secondary">or</Typography>
          </Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>
              Sign up with Google
            </Button>
            <Button variant="outlined" fullWidth startIcon={<FacebookIcon />}>
              Sign up with Facebook
            </Button>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </ThemeProvider>
  );
}
