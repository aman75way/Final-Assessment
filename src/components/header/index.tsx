import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppSelector, useAppDispatch } from "../../store/store";
// import { logout } from "../../store/reducers/authReducer";
import { motion } from "motion/react";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';


const Header: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleLogout = () => {
    // dispatch(logout());
    setMobileOpen(false);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { text: "Home", path: "/" },
    { 
      text: "My Resumes", 
      path: "/resumes", 
      icon: <ListIcon /> 
    },
    { 
      text: "Create Resume", 
      path: "/create-resume", 
      icon: <DocumentScannerIcon /> 
    },
    { 
      text: "My Cover Letters", 
      path: "/cover-letters", 
      icon: <ArticleIcon /> 
    },
    { 
      text: "Create Cover Letter", 
      path: "/create-cover-letter", 
      icon: <DescriptionIcon /> 
    },
    { 
      text: isAuthenticated ? "Profile" : "Sign In", 
      path: isAuthenticated ? "/profile" : "/signin",
      icon: <LoginIcon /> 
    }
  ];
  
  const drawerContent = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          key={item.path} 
          component={Link} 
          to={item.path} 
          onClick={handleDrawerToggle}
          sx={{
            "&:hover": {
              backgroundColor: theme.palette.secondary.main, 
              transition: "all 0.3s ease",
            },
          }}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      {isAuthenticated && (
        <ListItem onClick={handleLogout} sx={{
          "&:hover": {
            backgroundColor: theme.palette.secondary.main, 
            transition: "all 0.3s ease",
          },
        }}>
          <ListItemText primary="Logout" sx={{
            fontWeight: 500,
            fontSize: "16px",
          }} />
        </ListItem>
      )}
    </List>
  );
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AppBar 
          position="static" 
          color="primary" 
          sx={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
          }}
        >
          <Toolbar sx={{ padding: "0 20px" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, fontSize: "24px" }}>
              Resume Builder
            </Typography>
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    ":hover": { 
                      backgroundColor: theme.palette.secondary.main 
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            ) : (
              <>
                {menuItems.map((item) => (
                  <motion.div 
                    key={item.path} 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        margin: "0 10px",
                        ":hover": {
                          backgroundColor: theme.palette.secondary.main,
                          transition: "all 0.3s ease"
                        }
                      }}
                    >
                      {item.text}
                    </Button>
                  </motion.div>
                ))}
                {isAuthenticated && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      color="inherit"
                      onClick={handleLogout}
                      sx={{
                        margin: "0 10px",
                        ":hover": {
                          backgroundColor: theme.palette.secondary.main,
                          transition: "all 0.3s ease"
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;