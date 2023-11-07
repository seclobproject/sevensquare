import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = {
        loggedUser: action.payload,
      };
      state.users.push(user);
    },
    logoutUser: (state, action) => {
      state.users = [];
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;