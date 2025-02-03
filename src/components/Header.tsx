"use client";

import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MoreIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/fetchWrapper";
import { useMemo, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

const settings = [{ title: "Profile", route: "/profile" }, { title: "Logout" }];

function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const router = useRouter();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { data: session } = useSession();

  const settings = useMemo(
    () => [
      { title: "Profile", route: `/profile/${session?.user._id}` },
      { title: "Logout" },
    ],
    [session]
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <p>Playlists</p>
      </MenuItem>
      <MenuItem>
        <p>Likes</p>
      </MenuItem>
      <MenuItem>
        <p>Upload</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#373737" }}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <Link
                href={"/"}
                style={{ color: "unset", textDecoration: "none" }}
              >
                SoundCloud
              </Link>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {session ? (
                <>
                  {[
                    { title: "Playlists", route: "/playlist" },
                    { title: "Likes", route: "/like" },
                    { title: "Uploads", route: "/track/upload" },
                  ].map((item, index) => {
                    return (
                      <Button
                        key={index}
                        sx={{
                          color: "#fff",
                          textTransform: "capitalize",
                          fontWeight: 400,
                          fontSize: "1rem",
                        }}
                        href={item.route}
                        component={Link}
                      >
                        {item.title}
                      </Button>
                    );
                  })}

                  {/* desktop menu open button       */}
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, marginLeft: 2 }}
                    >
                      <Avatar src={fetchDefaultImages(session.user.type)} />
                    </IconButton>
                  </Tooltip>
                  {/* desktop menu     */}
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting.title}
                        onClick={() => {
                          if (setting.route) router.push(setting.route);
                          else signOut();

                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">
                          {setting.title}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  sx={{
                    color: "#fff",
                    textTransform: "capitalize",
                    fontWeight: 400,
                    fontSize: "1rem",
                  }}
                  onClick={() => router.push("/auth/signin")}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* mobile menu open button       */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}

export default Header;
