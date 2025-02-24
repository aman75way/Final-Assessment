import React from "react";
import { Box, Theme, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { createStyles } from "@mui/styles";
import Header from "../components/header";
import Footer from "../components/footer";

const useStyle = (theme: Theme) => createStyles({
  root: {
    backgroundColor: "lightgrey",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      backgroundColor: "lightblue",
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
});

const Basic: React.FC = () => {
  const theme = useTheme();
  const styles = useStyle(theme);

  return (
    <Box sx={styles.root}>
      <Header />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Basic;