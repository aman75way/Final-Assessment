import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        backdropFilter: "blur(15px)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.15)",
        width: "100%",
      }}
    >
      <Box
        sx={{
          color: "black",
          py: 4,
          px: 3,
          width: "100%",
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            justifyContent="space-between"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography variant="h6" fontWeight="bold">
                  JobBoard
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  Find the best job opportunities tailored for you.
                </Typography>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography variant="h6" fontWeight="bold">
                  Quick Links
                </Typography>
                {["Home", "Jobs", "Contact Us"].map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": { color: "#4CAF50" },
                      }}
                    >
                      {link}
                    </Typography>
                  </motion.div>
                ))}
              </motion.div>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography variant="h6" fontWeight="bold">
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  Email: support@jobboard.com
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Phone: +1 234 567 890
                </Typography>
              </motion.div>
            </Grid>
          </Grid>

          {/* Copyright */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "gray" }}>
              © {new Date().getFullYear()} JobBoard. All Rights Reserved.
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </motion.footer>
  );
};

export default Footer;
