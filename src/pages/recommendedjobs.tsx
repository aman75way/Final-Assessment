import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../store/slices/jobSlice";
import { AppDispatch, RootState } from "../store/store";
import JobCard from "../components/JobCard"; // Import JobCard component
import { Box, Skeleton, Typography, Grid } from "@mui/material"; // Import MUI components
import { motion } from "motion/react"; // Correct import for framer-motion

const RecommendedJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id) || "";
  const { recommendedJobs, status } = useSelector(
    (state: RootState) => state.jobs
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchRecommendedJobs(userId));
    }
  }, [dispatch, userId]);

  return (
    <Box p={5}>
      {/* If loading, show skeleton loaders */}
      {status === "loading" ? (
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "black" }}
          >
            Recommended Jobs
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{ maxWidth: "100vw", px: 2, justifyContent: "center" }}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: "16px" }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, color: "black" }}
          >
            Recommended Jobs
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{ maxWidth: "100vw", px: 2, justifyContent: "center" }}
          >
            {recommendedJobs.map((job: Job, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <JobCard job={job} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default RecommendedJobs;
