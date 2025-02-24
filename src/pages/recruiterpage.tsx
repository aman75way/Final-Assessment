import { useState } from "react";
import { Box, Button, Typography, Card, CardContent, Grid, Chip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import AddJobModal from "../components/AddJobModal";
import { motion } from "motion/react";
import DeleteIcon from "@mui/icons-material/Delete";
// import { deleteJob } from "../store/slices/jobSlice";
import { toast } from "react-toastify";

const RecruiterPage = () => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; jobId: string | null }>({ open: false, jobId: null });

  const jobs = useSelector((state: RootState) => state.jobs.jobsList);
  const dispatch = useDispatch();

  // Retrieve logged-in recruiter
  const recruiter = JSON.parse(sessionStorage.getItem("user") || "null");

  // Filter jobs created by the logged-in recruiter
  const recruiterJobs = jobs.filter((job) => job.creator === recruiter.name);

  // Handle job deletion
  const handleDeleteJob = () => {
    if (confirmDelete.jobId) {
      dispatch(deleteJob(confirmDelete.jobId));
    }
    setConfirmDelete({ open: false, jobId: null });
    toast.success("Job Deleted Successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
        }}
      >
        {/* Header */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          Recruiter Dashboard
        </Typography>

        {/* Create Job Button */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
            onClick={() => setOpen(true)}
          >
            + Create New Job
          </Button>
        </Box>

        {/* Job Listings */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, textAlign: "center" }}>
          Your Job Listings
        </Typography>

        {recruiterJobs.length > 0 ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {recruiterJobs.map((job) => (
              <Grid item xs={12} sm={6} key={job.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      padding: "20px",
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(12px)",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography sx={{ color: "gray" }}>Company: {job.company}</Typography>
                      <Typography sx={{ color: "gray" }}>Location: {job.location}</Typography>
                      <Typography sx={{ color: "gray" }}>Type: {job.type}</Typography>

                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {job.skillsRequired.map((skill) => (
                          <Chip key={skill} label={skill} variant="outlined" sx={{ fontSize: "12px" }} />
                        ))}
                      </Box>

                      {/* Delete Button */}
                      <IconButton
                        onClick={() => setConfirmDelete({ open: true, jobId: job.id })}
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "red",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="body1"
            sx={{
              mt: 3,
              color: "gray",
              textAlign: "center",
              fontStyle: "italic",
              fontSize: "18px",
              padding: "20px",
            }}
          >
            No job openings created yet.
          </Typography>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, jobId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, jobId: null })}>Cancel</Button>
          <Button onClick={handleDeleteJob} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddJobModal open={open} handleClose={() => setOpen(false)} />
    </motion.div>
  );
};

export default RecruiterPage;
