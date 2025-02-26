import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateResume } from "../store/slices/resumeSlice";
import { Button, CircularProgress, Typography, TextField } from "@mui/material";
import { motion } from "motion/react";
import { AppDispatch, RootState } from "../store/store";

const ResumeBuilder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resumeURL, isLoading, error } = useSelector((state: RootState) => state.resume);
  
  const [description, setDescription] = useState(""); // Store user input

  const handleGenerateResume = () => {
    if (description.trim() === "") return;
    dispatch(generateResume(description));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}
    >
      <Typography variant="h4" gutterBottom>
        AI-Based Resume Generator
      </Typography>
      
      <TextField
        label="Enter Resume Summary"
        multiline
        rows={4}
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ width: "80%", marginBottom: "20px" }}
      />

      <Button
        variant="contained"
        onClick={handleGenerateResume}
        disabled={isLoading || description.trim() === ""}
        sx={{ backgroundColor: "black", color: "white", padding: "12px", fontSize: "16px", borderRadius: "8px", "&:hover": { backgroundColor: "#333" } }}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Generate Resume"}
      </Button>

      {error && <Typography color="error" sx={{ marginTop: "10px" }}>{error}</Typography>}

      {resumeURL && (
        <Typography variant="body1" sx={{ marginTop: "20px" }}>
          <a href={resumeURL} target="_blank" rel="noopener noreferrer">View Generated Resume</a>
        </Typography>
      )}
    </motion.div>
  );
};

export default ResumeBuilder;
