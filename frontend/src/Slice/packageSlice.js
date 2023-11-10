import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Redux action to get all the packages
export const fetchPackage = createAsyncThunk("fetchPackage", async () => {
  const response = await axios.get("/api/packages");
  return response.data;
});

const initialState = {
  isLoading: false,
  data: null,
  isError: false,
};

export const packageSlice = createSlice({
  name: "package",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPackage.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPackage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchPackage.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export default packageSlice.reducer;
