import { Box, Grid, Typography, Button, TextField, MenuItem, CircularProgress, Skeleton } from "@mui/material";
import { motion } from "motion/react";
import JobCard from "../components/JobCard";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState, useEffect } from "react";

const HomePage = () => {
  // const jobListings = useSelector((state: RootState) => state.jobs.jobsList);
  // ---- TEMPORARY MOCK DATA ----
  const jobListings : Job[] = [
  ]
  // --------
  const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]"); 
  const [filteredJobs, setFilteredJobs] = useState(storedJobs || jobListings);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const jobsPerPage = 9;
  const user = useSelector((state: RootState) => state.auth.user);

  const [filters, setFilters] = useState({ location: "", type: "", skills: "" });

  // Handle filters on input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters dynamically
  useEffect(() => {
    const filtered = storedJobs.filter((job: Job) => {
      return (
        (filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
        (filters.type ? job.type.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
        (filters.skills
          ? job.skillsRequired.some((skill: string) =>
              skill.toLowerCase().includes(filters.skills.toLowerCase())
            )
          : true)
      );
    });
    setFilteredJobs(filtered);
  }, [filters, storedJobs]);

  // Pagination loading effect
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [page]);

  const displayedJobs = filteredJobs.slice(0, page * jobsPerPage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        paddingBottom: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginTop: "5rem" }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold", color: "black", fontSize: { xs: "2rem", md: "3.5rem" }, m : {sm : "0 45px"}}}>
          Get Your First Job with Us
        </Typography>
        <Typography variant="h5" sx={{ color: "#333", mt: 2, mb: 4, fontSize: { xs: "1rem", md: "1.5rem" }, m:{  } }}>
          Explore the best job opportunities that match your skills
        </Typography>
        {!user && (
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Sign Up
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filters Section */}
      <Box sx={{ mt: 6, width: "80%", display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
        <TextField
          select
          label="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        >
          <MenuItem value="">All Locations</MenuItem>
          {Array.from(new Set(storedJobs.map((job: Job) => job.location))).map((loc) => (
            <MenuItem key={loc as string} value={loc as string}>
              {loc as string}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Job Type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        >
          <MenuItem value="">All Types</MenuItem>
          {Array.from(new Set(storedJobs.map((job: Job) => job.type))).map((type) => (
            <MenuItem key={type as string} value={type as string}>
              {type as String}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Skills Required"
          name="skills"
          value={filters.skills}
          onChange={handleFilterChange}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        />
      </Box>

      {/* Job Listings */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "black" }}>
          Latest Job Openings
        </Typography>

        <Grid container spacing={4} sx={{ maxWidth: "90vw", px: 2, justifyContent: "center" }}>
          {loading
            ? Array.from({ length: 9 }).map((_, index) => (
                <Grid item xs={12} sm={6} width={"90vw"} md={4} key={index}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
                </Grid>
              ))
            : displayedJobs.map((job: Job, index: number) => (
                <Grid item xs={12} sm={10} md={4} width={"90vw"} key={job.id}>
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

      {/* Load More Button */}
      {displayedJobs.length < filteredJobs.length && (
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
          <Button
            variant="contained"
            onClick={() => setPage((prev) => prev + 1)}
            sx={{
              mt: 4,
              backgroundColor: "black",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: "20px",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Load More Jobs"}
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export default HomePage;