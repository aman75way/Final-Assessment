import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Box, Typography, Paper, Button, Grid, Chip } from "@mui/material";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase"; // Import your Supabase client
import { fetchRecruiterApplications, updateApplicationStatus } from "../store/slices/applicationSlice";

const statusColors: Record<string, string> = {
  Pending: "#f1c40f",
  Accepted: "#2ecc71",
  Rejected: "#e74c3c",
};

const RecruiterApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // State to hold applications and jobs
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user?.role === "RECRUITER") {
      fetchJobs(user.id);
      fetchApplications(user.id);
    }
  }, [user]);

  const fetchJobs = async (userId: string) => {
    const { data, error } = await supabase
      .from("jobs")
      .select()
      .eq("creator", userId);

    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobs(data);
    }
  };

  // Fetch applications for the recruiter
  const fetchApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(*)")
      .eq("recruiter_id", userId); 
    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data); 
    }
  };

  // Function to update application status
  const handleDecision = async (id: string, status: "Accepted" | "Rejected") => {
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id); // Update application status

    if (error) {
      console.error("Error updating application status:", error);
    } else {
      dispatch(updateApplicationStatus({ id, status })); // Dispatch Redux action to update the state
    }
  };

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
            {applications.map((app) => {
              // Get the job details from the job table (join them from the `jobs` table)
              const job = app.jobs || {};
              return (
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
                        {job.title || "Unknown Job"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {job.company || "Unknown Company"} - {job.location || "Unknown Location"}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Applicant ID: {app.user_id}
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
              );
            })}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default RecruiterApplications;
