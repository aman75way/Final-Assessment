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

// Async Thunk: Generate Resume and Upload to Supabase
export const generateResume = createAsyncThunk(
  "resume/generateResume",
  async (description: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const user = state.auth.user; // Get logged-in user data

    if (!user) return rejectWithValue("User not authenticated.");

    try {
      // 1. Generate Resume PDF via FastAPI
      const response = await fetch("http://127.0.0.1:8000/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          email: user.email,
          skills: user.skills,
          description: description, // Take description from user input
        }),
      });

      if (!response.ok) throw new Error("Resume generation failed.");

      // Convert response into a Blob (PDF file)
      const pdfBlob = await response.blob();
      const fileName = `resume_${user.id}.pdf`;

      // 2. Upload generated resume to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("userResume")
        .upload(`resume/${fileName}`, pdfBlob, { contentType: "application/pdf" });

      if (uploadError) throw new Error(uploadError.message);

      // 3. Get the Public Resume URL from Supabase
      const resumeURL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/userResume/resume/${fileName}`;

      // 4. Update resumeURL in Supabase Database
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
