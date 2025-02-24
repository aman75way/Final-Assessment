import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Box, Typography, Paper, Button, Grid, Chip } from "@mui/material";
import { motion } from "motion/react";
import { useEffect } from "react";
import { fetchRecruiterApplications, updateApplicationStatus } from "../store/slices/applicationSlice";

const statusColors: Record<string, string> = {
  Pending: "#f1c40f",
  Accepted: "#2ecc71",
  Rejected: "#e74c3c",
};

const RecruiterApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user?.role === "RECRUITER") {
      dispatch(fetchRecruiterApplications());
    }
  }, [dispatch, user]);

  // Ensure the user is a recruiter
  if (!user || user.role !== "RECRUITER") {
    return (
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          color: "red",
          marginTop: "50px",
        }}
      >
        Access Denied: Only recruiters can view applications.
      </Typography>
    );
  }

  // Fetch applications and map job details from state.jobs
  const applications = useSelector((state: RootState) =>
    state.applications.applicationsList
      .filter((app) => app.recruiterId === user.id)
      .map((app) => {
        const job = state.jobs.jobs.find((j) => j.id === app.jobId);

        return {
          ...app,
          jobTitle: job?.title || "Unknown Job",
          companyName: job?.company || "Unknown Company",
          location: job?.location || "Unknown Location",
        };
      })
  );

  // Function to update application status
  const handleDecision = (id: string, status: "Accepted" | "Rejected") => {
    dispatch(updateApplicationStatus({ id, status }));
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
          p: { xs: "20px", md: "40px" },
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
              p: "20px",
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
                      {app.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {app.companyName} - {app.location}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Applicant ID: {app.userId}
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
                        onClick={() => handleDecision(app.id, "Accepted")}
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
                        onClick={() => handleDecision(app.id, "Rejected")}
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
