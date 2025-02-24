import { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, CircularProgress } from "@mui/material";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import {supabase} from "../services/supabase";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const statusColors = {
  Pending: "#f1c40f",
  Approved: "#2ecc71",
  Rejected: "#e74c3c",
  Accepted: "#3498db",
};

const UserApplications = () => {
  const user = useSelector((state : RootState) => state.auth.user);

  // State for applications and loading/error handling
  interface Application {
    id: string;
    job_id: string;
    status: "Pending" | "Approved" | "Rejected" | "Accepted";
    job: {
      id?: string;
      title?: string;
      company?: string;
    };
  }
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your applications.");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        // Fetch applications from Supabase
        const { data: apps, error } = await supabase
          .from("applications")
          .select("id, job_id, status")
          .eq("user_id", user.id);

        if (error) throw error;

        // Fetch job details for each application
        const jobIds = apps.map((app) => app.job_id);
        const { data: jobs, error: jobError } = await supabase
          .from("jobs")
          .select("id, title, company")
          .in("id", jobIds);

        if (jobError) throw jobError;

        // Map applications with job details
        const appsWithDetails = apps.map((app) => ({
          ...app,
          job: jobs.find((job) => job.id === app.job_id) || {},
        }));

        setApplications(appsWithDetails);
      } catch (error : any) {
        console.error("Error fetching applications:", error.message);
        toast.error("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.id]);

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

        {loading ? (
          <CircularProgress sx={{ color: "black" }} />
        ) : applications.length === 0 ? (
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
                  {app.job?.title || "Unknown Job"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {app.job?.company || "Unknown Company"}
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
