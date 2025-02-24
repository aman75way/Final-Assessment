import { Box, Typography, Button } from "@mui/material";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
// import { applyForJob } from "../store/slices/applicationSlice";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";



interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

interface JobCardProps {
  job: Job;
}


const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const handleApply = () => {
    if (!user || user.role !== "USER") return;

    setLoading(true);
    setTimeout(() => {
      // dispatch(applyForJob({ userId: user.id, jobId: job.id }));
      setLoading(false);
      toast.success("Application submitted successfully!");
    }, 1000); // Simulate network delay
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: "16px",
          backdropFilter: "blur(15px)", // Increased blur
          backgroundColor: "rgba(255, 255, 255, 0.3)", // More transparency
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          width: "100%",
          maxWidth: 350,
          margin: "auto",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            transform: "scale(1.05)",
          }
          // marginRight: { xs: 2, sm: 1, md: 6 }
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: "black" }}>
          {job.title}
        </Typography>
        <Typography variant="body1" sx={{ color: "black" }}>
          {job.company}
        </Typography>
        <Typography variant="body2" sx={{ color: "black" }}>
          {job.location} | {job.type}
        </Typography>
        {!user || user.role === "USER" ? (
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
              borderRadius: "12px",
              width: "100%",
            }}
            onSubmit={handleApply}
          >
           {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Apply Now"}
          </Button>
        ) : ""}

      </Box>
    </motion.div>
  );
};

export default JobCard;
