import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

//Redux action to get all users
export const fetchUser = createAsyncThunk("fetchUsers", async() => {
  const response = await axios.post("/api/users/get-users");
  return response.json();
});

const initialState = {
  isLoading: false,
  data: null,
  isError: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export default userSlice.reducer;