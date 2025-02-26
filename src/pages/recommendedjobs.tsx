import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../store/slices/jobSlice";
import { AppDispatch, RootState } from "../store/store";
import JobCard from "../components/JobCard"; // Import JobCard component

import { Box, CircularProgress, Typography, Grid, Alert } from "@mui/material"; // Import MUI components

const RecommendedJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id) || "";
  const { recommendedJobs, status } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (userId) {
      dispatch(fetchRecommendedJobs(userId));
    }
  }, [dispatch, userId]);

  return (
    <Box p={5}>
      <Typography variant="h5" component="h2" gutterBottom>
        Recommended Jobs
      </Typography>

      {status === "loading" && <CircularProgress />}
      {status === "failed" && <Alert severity="error">Error fetching recommendations.</Alert>}

      <Grid container spacing={3}>
        {recommendedJobs.map((job) => (
            <Grid item xs={12} sm={6} lg={4} key={job.id}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendedJobs;
