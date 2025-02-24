import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import { toast } from "react-toastify";
import { RootState } from "../store";

const initialState: ApplicationsState = {
  applicationsList: [],
  loading: false,
  error: null,
};

// Fetch Applications (GET from Supabase)
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from("applications").select("*");
    if (error) return rejectWithValue(error.message);
    return data as Application[];
  }
);

// Fetch Applications for a Recruiter (GET from Supabase)
export const fetchRecruiterApplications = createAsyncThunk(
  "applications/fetchRecruiterApplications",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const recruiterId = state.auth.user?.id;

    if (!recruiterId) {
      return rejectWithValue("Recruiter ID not found");
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("recruiter_id", recruiterId); // Fetch applications for the recruiter

    if (error) return rejectWithValue(error.message);
    return data as Application[];
  }
);


// Add Application (INSERT into Supabase)
export const addApplication = createAsyncThunk(
  "applications/addApplication",
  async (
    { user_id, job_id }: { user_id: string; job_id: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("applications")
      .insert([{ user_id, job_id, status: "Pending" }])
      .select();

      console.log(data);

    if (error) return rejectWithValue(error.message);
    toast.success("Application submitted successfully!");
    return data[0] as Application;
  }
);

// Update Application Status (UPDATE in Supabase)
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async (
    { id, status }: { id: string; status: "Accepted" | "Rejected" },
    { rejectWithValue }
  ) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    toast.success(`Application ${status}!`);
    return { id, status };
  }
);

// Remove Application (DELETE from Supabase)
export const removeApplication = createAsyncThunk(
  "applications/removeApplication",
  async (id: string, { rejectWithValue }) => {
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

// Application Slice
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchApplications.fulfilled,
        (state, action: PayloadAction<Application[]>) => {
          state.loading = false;
          state.applicationsList = action.payload;
        }
      )
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Application
      .addCase(
        addApplication.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.applicationsList.push(action.payload);
        }
      )

      // Update Application Status
      .addCase(
        updateApplicationStatus.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; status: "Accepted" | "Rejected" }>
        ) => {
          const application = state.applicationsList.find(
            (app) => app.id === action.payload.id
          );
          if (application) {
            application.status = action.payload.status;
          }
        }
      )

      // Remove Application
      .addCase(
        removeApplication.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.applicationsList = state.applicationsList.filter(
            (app) => app.id !== action.payload
          );
        }
      );
  },
});

export default applicationSlice.reducer;
