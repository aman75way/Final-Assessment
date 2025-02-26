import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "motion/react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.error("Logged out successfully!");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backdropFilter: "blur(15px)", // Glassmorphism effect
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <AppBar
        position="static"
        sx={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 3 }}
        >
          {/* Logo / Home */}
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", cursor: "pointer", color: "black" }}
            onClick={() => navigate("/")}
          >
            JobBoard
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <Typography
                variant="body1"
                sx={{ cursor: "pointer", color: "black" }}
                onClick={() => navigate("/")}
              >
                HOME
              </Typography>
            </motion.div>

            {user?.role === "USER" && (
              <>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", color: "black" }}
                    onClick={() => navigate("/applications")}
                  >
                    APPLICATIONS
                  </Typography>
                </motion.div>
                {/* <motion.div whileHover={{ scale: 1.1 }}>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", color: "black" }}
                    onClick={() => navigate("/resume-builder")}
                  >
                    RESUME
                  </Typography>
                </motion.div> */}
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", color: "black" }}
                    onClick={() => navigate("/recommended-jobs")}
                  >
                    RECOMMENDATIONS
                  </Typography>
                </motion.div>
              </>
            )}

            {user?.role === "RECRUITER" && (
              <>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", color: "black" }}
                    onClick={() => navigate("/recruiter")}
                  >
                    JOBS
                  </Typography>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", color: "black" }}
                    onClick={() => navigate("/recruiter/applications")}
                  >
                    APPLICATIONS
                  </Typography>
                </motion.div>
              </>
            )}

            {/* User Dropdown */}
            {user ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: "black", ml: 2 }}
                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    mt: 1,
                    "& .MuiPaper-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      color: "black",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <MenuItem disabled>
                    {user.name} - {user.role}
                  </MenuItem>
                  {user.skills && user.skills.length > 0 && (
                    <Box sx={{ padding: "8px 16px" }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Skills:
                      </Typography>
                      {user.skills.map((skill, index) => (
                        <Typography key={index} variant="body2">
                          {skill}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: "black" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    px: 3,
                    py: 1,
                    borderRadius: "20px",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  Sign Up / Login
                </Button>
              </motion.div>
            )}
          </Box>

          {/* Mobile Menu - Hamburger Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "black" }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            sx={{
              "& .MuiPaper-root": {
                width: "250px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <List sx={{ mt: 2 }}>
              <ListItem
                button
                onClick={() => {
                  navigate("/");
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary="HOME" />
              </ListItem>

              {user?.role === "USER" && (
                <>
                  <ListItem
                    button
                    onClick={() => {
                      navigate("/applications");
                      setMobileOpen(false);
                    }}
                  >
                    <ListItemText primary="APPLICATIONS" />
                  </ListItem>
                  {/* <ListItem
                    button
                    onClick={() => {
                      navigate("/resume-builder");
                      setMobileOpen(false);
                    }}
                  >
                    <ListItemText primary="RESUME" />
                  </ListItem> */}
                  <ListItem
                    button
                    onClick={() => {
                      navigate("/recommended-jobs");
                      setMobileOpen(false);
                    }}
                  >
                    <ListItemText primary="RECOMMENDATIONS" />
                  </ListItem>
                </>
              )}

              {user?.role === "RECRUITER" && (
                <>
                  <ListItem
                    button
                    onClick={() => {
                      navigate("/recruiter");
                      setMobileOpen(false);
                    }}
                  >
                    <ListItemText primary="JOBS" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => {
                      navigate("/recruiter/applications");
                      setMobileOpen(false);
                    }}
                  >
                    <ListItemText primary="APPLICATIONS" />
                  </ListItem>
                </>
              )}

              {/* Skills in Mobile */}
              {user?.skills && user.skills.length > 0 && (
                <Box sx={{ padding: "8px 16px" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Skills: {user.skills.map((skill) => skill).join(", ")}
                  </Typography>
                </Box>
              )}

              {user ? (
                <>

                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="LOGOUT" />
                  </ListItem>
                </>
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary="SIGN UP / LOGIN" />
                </ListItem>
              )}
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
