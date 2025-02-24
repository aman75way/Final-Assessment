import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    loginEnd: (state) => {
      state.isLoading = false;
    },
    signUpStart: (state) => {
      state.isLoading = true;
    },
    signUpUser: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    signUpEnd: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
    },
    userUpdate: (state, action:  PayloadAction<Omit<User, "password">>) => {
      state.isLoading = true;
      state.user = action.payload;
      state.isLoading = false
    }
  },
});

export const { loginStart, loginUser, loginEnd, logout, signUpStart, signUpUser, signUpEnd, userUpdate } = authSlice.actions;

export default authSlice.reducer;
