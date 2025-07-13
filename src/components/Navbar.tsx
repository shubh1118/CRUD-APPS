// src/components/Navbar.tsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import NextLink from "next/link";

const navPages = [
  { name: "Home", path: "/" },
  { name: "Admin", path: "/admin" },
  { name: "Sign Up", path: "/signup" },
  { name: "Login", path: "/login" },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      {" "}
      {/* YAHAN CHANGE KIYA HAI */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Large screens: ART GALLERY text */}
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
              color: "white", // YAHAN COLOR WHITE KIYA HAI
              textDecoration: "none",
            }}
          >
            ART GALLERY
          </Typography>

          {/* Small screens: Hamburger menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit" // IconButton color typically inherits from AppBar, which is now black, so text inside is white
            >
              <MenuIcon sx={{ color: "white" }} />{" "}
              {/* YAHAN ICON KA COLOR WHITE KIYA HAI */}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navPages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <NextLink
                    href={page.path}
                    passHref
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      {page.name}
                    </Typography>{" "}
                    {/* MenuItem text color for contrast on white menu */}
                  </NextLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Small screens: ART GALLERY text (for when hamburger is visible) */}
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
              color: "white", // YAHAN COLOR WHITE KIYA HAI
              textDecoration: "none",
            }}
          >
            ART GALLERY
          </Typography>

          {/* Large screens: Navigation Buttons */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            {navPages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }} // YAHAN COLOR WHITE KIYA HAI
                component={NextLink}
                href={page.path}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
