import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateApplicationStatus } from "../store/slices/applicationSlice";
import { Box, Typography, Paper, Button, Grid, Chip } from "@mui/material";
import { motion } from "motion/react";

const statusColors = {
  Pending: "#f1c40f",
  Accepted: "#2ecc71",
  Rejected: "#e74c3c",
};

const RecruiterApplications = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const applications = useSelector((state: RootState) =>
    state.applications.applicationsList.filter((app) =>
      state.jobs.jobsList.find((job) => job.creator === user?.name && job.id === app.jobId)
    )
  );

  const handleDecision = (id: string, status: "Accepted" | "Rejected", userEmail: string) => {
    dispatch(updateApplicationStatus({ id, status, userEmail }));
  };

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
          maxWidth: "900px",
          padding: { xs: "20px", md: "40px" },
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          Job Applications
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
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {applications.map((app) => (
              <Grid item xs={12} md={6} key={app.id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "100%" }}
                >
                  <Paper
                    sx={{
                      p: 3,
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

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#2ecc71",
                          color: "white",
                          "&:hover": { backgroundColor: "#27ae60" },
                        }}
                        onClick={() => handleDecision(app.id, "Accepted", "applicant@example.com")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#e74c3c",
                          color: "white",
                          "&:hover": { backgroundColor: "#c0392b" },
                        }}
                        onClick={() => handleDecision(app.id, "Rejected", "applicant@example.com")}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default RecruiterApplications;
