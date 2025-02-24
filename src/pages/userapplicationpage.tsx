import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { motion } from "motion/react";

const statusColors = {
  Pending: "#f1c40f",
  Approved: "#2ecc71",
  Rejected: "#e74c3c",
  Accepted: "#3498db", // Add the color for the Accepted status
};

const UserApplications = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const applications = useSelector((state: RootState) =>
    state.applications.applicationsList.filter((app) => app.userId === user?.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          padding: { xs: "20px", md: "40px" },
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          Your Applications
        </Typography>

        {applications.length === 0 ? (
          <Typography
            sx={{
              fontSize: "18px",
              fontStyle: "italic",
              color: "gray",
              padding: "20px",
            }}
          >
            No applications found.
          </Typography>
        ) : (
          applications.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%" }}
            >
              <Paper
                sx={{
                  p: 3,
                  mb: 2,
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Job ID: {app.jobId}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={app.status}
                    sx={{
                      backgroundColor: statusColors[app.status] || "gray",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          ))
        )}
      </Box>
    </motion.div>
  );
};

export default UserApplications;
