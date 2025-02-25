import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import { RootState } from "../store";

// Define state structure
interface ResumeState {
  resumeURL: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ResumeState = {
  resumeURL: null,
  isLoading: false,
  error: null,
};

export const generateResume = createAsyncThunk(
  "resume/generateResume",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const user = state.auth.user; // Get logged-in user data

    if (!user) return rejectWithValue("User not authenticated.");

    try {
      const response = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          skills: user.skills,
          description: "A brief summary about the user", // Can be dynamic
        }),
      });

      if (!response.ok) throw new Error("Resume generation failed.");

      // Get the PDF blob from response
      const pdfBlob = await response.blob();
      const fileName = `resume_${user.id}.pdf`;

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("userResume")
        .upload(`resume/${fileName}`, pdfBlob, { contentType: "application/pdf" });

      if (uploadError) throw new Error(uploadError.message);

      const resumeURL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/userResume/resume/${fileName}`;

      // 2. Update resumeURL in Supabase DB
      const { error: updateError } = await supabase
        .from("users")
        .update({ resumeURL })
        .eq("id", user.id);

      if (updateError) throw new Error(updateError.message);

      return resumeURL;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Resume Slice
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeURL = action.payload;
      })
      .addCase(generateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default resumeSlice.reducer;
