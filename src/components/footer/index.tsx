import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", py: 2, backgroundColor: "#f1f1f1" }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} 75 - All rights reserved
      </Typography>
      <Link href="/terms" underline="hover">Terms of Service</Link> | 
      <Link href="/privacy" underline="hover">Privacy Policy</Link>
    </Box>
  );
};

export default Footer;