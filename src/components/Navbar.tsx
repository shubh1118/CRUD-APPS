// src/components/Navbar.tsx
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAuth } from "../utils/AuthContext";

const allNavPages = [
  { name: "Home", path: "/" },
  { name: "Admin", path: "/admin" },
  { name: "Sign Up", path: "/admin/signup" },
  { name: "Login", path: "/admin/login" },
  { name: "Logout", path: "/logout-action" },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const router = useRouter();
  const { isAuthenticated, logout, loading } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    handleCloseNavMenu();
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      if (error instanceof Error) {
        toast.error(`Logout failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during logout.");
      }
    }
  };

  const navPages = React.useMemo(() => {
    if (loading) return [];
    if (isAuthenticated) {
      return allNavPages.filter((page) =>
        ["Home", "Admin", "Logout"].includes(page.name)
      );
    } else {
      return allNavPages.filter((page) =>
        ["Home", "Login", "Sign Up"].includes(page.name)
      );
    }
  }, [isAuthenticated, loading]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={NextLink}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ART GALLERY
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {loading ? (
                <MenuItem>
                  <CircularProgress size={20} />
                  <Typography sx={{ ml: 1, color: "black" }}>
                    Loading...
                  </Typography>
                </MenuItem>
              ) : (
                navPages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={
                      page.name === "Logout" ? handleLogout : handleCloseNavMenu
                    }
                    sx={{
                      "&:hover": {
                        backgroundColor:
                          page.name === "Login"
                            ? "#28a745"
                            : page.name === "Logout"
                            ? "#dc3545"
                            : "#333",
                        color: "white",
                      },
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {page.name === "Logout" ? (
                      <Typography textAlign="center" sx={{ color: "black" }}>
                        {page.name}
                      </Typography>
                    ) : (
                      <NextLink
                        href={page.path}
                        passHref
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography textAlign="center" sx={{ color: "black" }}>
                          {page.name}
                        </Typography>
                      </NextLink>
                    )}
                  </MenuItem>
                ))
              )}
            </Menu>
          </Box>

          {/* Desktop Logo */}
          <Typography
            variant="h5"
            noWrap
            component={NextLink}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ART GALLERY
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            {loading ? (
              <Button sx={{ color: "white", textTransform: "none" }}>
                <CircularProgress size={20} color="inherit" />
                <Typography sx={{ ml: 1 }}>Loading...</Typography>
              </Button>
            ) : (
              navPages.map((page) => {
                const style = {
                  color: "white",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      page.name === "Login"
                        ? "#28a745"
                        : page.name === "Logout"
                        ? "#dc3545"
                        : "#333",
                  },
                };

                return page.name === "Logout" ? (
                  <Button key={page.name} onClick={handleLogout} sx={style}>
                    {page.name}
                  </Button>
                ) : (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={NextLink}
                    href={page.path}
                    sx={style}
                  >
                    {page.name}
                  </Button>
                );
              })
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
