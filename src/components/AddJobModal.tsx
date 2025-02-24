import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, Chip } from "@mui/material";
import { useDispatch } from "react-redux";
import { addJob } from "../store/slices/jobSlice";
import { toast } from "react-toastify";

interface AddJobModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const recruiter = JSON.parse(sessionStorage.getItem("user") || "null");

  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    type: "",
    skillsRequired: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  // Add Skill
  const addSkill = () => {
    if (skillInput.trim() && !jobData.skillsRequired.includes(skillInput.trim())) {
      setJobData({ ...jobData, skillsRequired: [...jobData.skillsRequired, skillInput.trim()] });
      setSkillInput("");
    }
  };

  // Remove Skill
  const removeSkill = (skill: string) => {
    setJobData({ ...jobData, skillsRequired: jobData.skillsRequired.filter((s) => s !== skill) });
  };

  // Submit Job
  const handleSubmit = () => {
    if (!jobData.title || !jobData.location || !jobData.type || !recruiter) return;

    const newJob = {
      title: jobData.title,
      company: recruiter.company, // Add company property
      location: jobData.location,
      type: jobData.type,
      skillsRequired: jobData.skillsRequired,
      creator: recruiter.name, // Store Recruiter Name
    };

    dispatch(addJob(newJob));
    toast.success("Job Created Successfully!");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          width: 420,
          margin: "auto",
          mt: "10vh",
          background: "rgba(255, 255, 255, 0.15)", // Glassmorphism Effect
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Create New Job
        </Typography>
        
        <TextField label="Title" name="title" fullWidth onChange={handleChange} sx={{ mt: 2 }} />
        <TextField label="Location" name="location" fullWidth onChange={handleChange} sx={{ mt: 2 }} />
        <TextField label="Type" name="type" fullWidth onChange={handleChange} sx={{ mt: 2 }} />
        
        {/* Skill Input */}
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Add Skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            fullWidth
          />
          <Button onClick={addSkill} sx={{ mt: 1, bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } }}>
            Add Skill
          </Button>
        </Box>

        {/* Skill Chips */}
        <Box sx={{ mt: 1 }}>
          {jobData.skillsRequired.map((skill) => (
            <Chip key={skill} label={skill} onDelete={() => removeSkill(skill)} sx={{ m: 0.5 }} />
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } }}
          onClick={handleSubmit}
        >
          Create Job
        </Button>
      </Box>
    </Modal>
  );
};

export default AddJobModal;
