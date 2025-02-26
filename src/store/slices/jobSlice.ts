import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { supabase } from "../../services/supabase";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000";  // FastAPI backend

interface JobState {
  jobs: Job[];
  recommendedJobs: Job[];
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial State
const initialState: JobState = {
  jobs: [],
  recommendedJobs: [],
  loading: false,
  status: "idle",
  error: null,
};

// ----------------- Thunks -----------------

// Fetch Jobs from Supabase
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Job to Supabase
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (newJob: Job, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([newJob])
        .select();
      if (error) throw error;
      toast.success("Job Created Successfully!");
      return data;
    } catch (error: any) {
      toast.error("Failed to create job.");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Job from Supabase
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) throw error;
      toast.success("Job Deleted Successfully!");
      return jobId;
    } catch (error: any) {
      toast.error("Failed to delete job.");
      return rejectWithValue(error.message);
    }
  }
);

// Fetch recommended jobs
export const fetchRecommendedJobs = createAsyncThunk(
  "jobs/fetchRecommendedJobs",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/recommend-jobs/${userId}`);
      console.log(response.data.recommended_jobs)
      return response.data.recommended_jobs;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ----------------- Slice -----------------
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Job
      .addCase(addJob.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.jobs.push(action.payload[0]);
      })

      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })

      // Fetch Recommended Jobs
      .addCase(fetchRecommendedJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecommendedJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recommendedJobs = action.payload.map((job : Job) => ({
          ...job,
          skillsRequired: job.skillsRequired || [], 
          creator: job.creator || "Unknown",       
          score: job.score ?? 0,                   
        }));
      });
           
  },
});

// Selectors
export const selectJobs = (state: RootState) => state.jobs.jobs;
export const selectRecommendedJobs = (state: RootState) => state.jobs.recommendedJobs;
export const selectJobLoading = (state: RootState) => state.jobs.loading;
export const selectJobStatus = (state: RootState) => state.jobs.status;
export const selectJobError = (state: RootState) => state.jobs.error;

// Reducer
export default jobSlice.reducer;
