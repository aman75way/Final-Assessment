import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { signUpStart, signUpUser, signUpEnd, logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import signupAnimation from "../../public/login.json"; // Lottie animation import
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase";


const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: { auth: { isLoading: boolean } }) => state.auth.isLoading);

  const [form, setForm] = useState<User>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "USER",
    resumeUpload: null,
    resumeURL : null,
    skills: [],
  });

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      id: uuidv4(),
    }));
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, resumeUpload: e.target.files[0] });
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && form.skills) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleSignUp = async () => {
    dispatch(signUpStart());

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      toast.error(`Error signing up: ${error.message}`);
      dispatch(signUpEnd());
      dispatch(logout())
      return;
    }

    if (form.resumeUpload) {
      // Get the file extension
      const fileExtension = form.resumeUpload.name.split('.').pop(); 
      const fileName = `${form.name}_${form.id}.${fileExtension}`;
  
      const { data: resumeUploadData, error: resumeUploadError } = await supabase.storage
        .from("userResume")
        .upload(`resume/${fileName}`, form.resumeUpload);
  
      if (resumeUploadError || !resumeUploadData) {
        toast.error(`Error uploading resume: ${resumeUploadError.message}`);
        dispatch(signUpEnd());
        dispatch(logout())
        return;
      }

      const url:string = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/userResume/resume/${fileName}`

      setForm({ ...form, resumeURL: url });
      console.log(form.resumeURL)
    }

    console.log(form.resumeURL)

    const {data : uploadData, error : uploadError} = await supabase.from("users").insert({
      id: form.id,
      name: form.name,
      email: form.email,  
      role: form.role,
      resumeURL: form.resumeURL,
      skills: form.skills
    })

    if (uploadError) {
      toast.error(`Error uploading data: ${uploadError.message}`);
      dispatch(signUpEnd());
      dispatch(logout())
      return;
    }

    dispatch(signUpUser(form));

    if (data) {
      dispatch(signUpEnd());
      console.log(data, uploadData)
      toast.success("Signed up successfully!");
      navigate("/");
    }

  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: "40px",
        gap: "40px",
      }}
    >
      {/* Left Side: Lottie Animation */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Lottie animationData={signupAnimation} style={{ width: "100%", maxWidth: "800px" }} />
      </Box>

      {/* Right Side: Sign Up Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <motion.fieldset
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            border: "2px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            padding: "40px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <legend
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              padding: "0 15px",
              color: "black",
            }}
          >
            Sign Up
          </legend>

          <TextField
            label="Name"
            name="name"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 3 }}
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 3 }}
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 3 }}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Role Selection (Radio Buttons) */}
          <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              row
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <FormControlLabel value="USER" control={<Radio />} label="User" />
              <FormControlLabel value="RECRUITER" control={<Radio />} label="Recruiter" />
            </RadioGroup>
          </FormControl>

          {/* Extra Fields for USER Role */}
          {form.role === "USER" && (
            <>
              <TextField
                type="file"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 3 }}
                onChange={handleFileChange}
              />

              <TextField
                label="Add Skill"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />

              <Button variant="outlined" sx={{ marginBottom: 3 }} onClick={handleAddSkill}>
                Add Skill
              </Button>

              {/* Display Added Skills */}
              <Box sx={{ marginBottom: 3 }}>
                {form.skills?.map((skill, index) => (
                  <Typography key={index} variant="body2" sx={{ display: "inline-block", marginRight: "8px", backgroundColor: "#f1f1f1", padding: "5px 10px", borderRadius: "8px" }}>
                    {skill}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          {/* Login Link */}
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                cursor: "pointer",
                color: "#1976d2",
                marginBottom: 3,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Click here!
            </Typography>
          </motion.div>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignUp}
            sx={{
              backgroundColor: "black",
              color: "white",
              padding: "14px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </motion.fieldset>
      </Box>
    </motion.div>
  );
};

export default SignUp;
