import { configureStore } from "@reduxjs/toolkit";
import { getUserReducer, loginUserReducer } from "Slice/userSlice";
import packageReducer from "Slice/packageSlice";

export const store = configureStore({
  reducer: { getUserReducer, loginUserReducer, packageReducer },
});
