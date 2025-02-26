import { Box, Typography, Button } from "@mui/material";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { addApplication } from "../store/slices/applicationSlice";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { AppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


interface JobCardProps {
  job: Job;
}


const JobCard: React.FC<JobCardProps> = ({ job }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleApply = (event : any) => {

    event.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
  
    setLoading(true);
    dispatch(addApplication({ user_id: user.id, job_id: job.id }))
      .unwrap()
      .finally(() => setLoading(false));
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
        data-job-id={job.id}
      >
        <Typography variant="h6" className="job-title" fontWeight="bold" sx={{ color: "black" }}>
          {job.title}
        </Typography>
        <Typography variant="body1" className="job-company" sx={{ color: "black" }}>
          {job.company}
        </Typography>
        <Typography variant="body2" className="job-location" sx={{ color: "black" }}>
          {job.location} | {job.type}
        </Typography>
        <Typography variant="body2" className="job-skills" sx={{ color: "black" }}>
          {job.skillsRequired.join(", ")}
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
            onClick={handleApply}
          >
           {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Apply Now"}
          </Button>
        ) : ""}

      </Box>
    </motion.div>
  );
};

export default JobCard;
