import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { supabase } from "../../services/supabase";
import { toast } from "react-toastify";

// Initial State
const initialState: JobState = {
  jobs: [],
  loading: false,
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

// ----------------- Slice -----------------
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(addJob.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.jobs.push(action.payload[0]);
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  },
});

// Selectors
export const selectJobs = (state: RootState) => state.jobs.jobs;
export const selectJobLoading = (state: RootState) => state.jobs.loading;
export const selectJobError = (state: RootState) => state.jobs.error;

// Reducer
export default jobSlice.reducer;
