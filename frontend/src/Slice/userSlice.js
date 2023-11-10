import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Redux action to get all users
export const fetchUsers = createAsyncThunk("fetchUser", async () => {
  const response = await axios.get("/api/users/get-users");
  return response.data;
});

const initialState = {
  isLoading: false,
  data: null,
  isError: false,
};

export const getUserSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

// Redux action to login user
export const loginUser = createAsyncThunk("loginUser", async (data) => {
  const response = await axios.post("/api/users/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
});

export const loginUserSlice = createSlice({
  name: "login",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export const getUserReducer = getUserSlice.reducer;
export const loginUserReducer = loginUserSlice.reducer;
