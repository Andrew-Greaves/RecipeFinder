import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    username: "",
    password: "",
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { setUsername, setPassword } = authSlice.actions;
export const selectUsername = (state) => state.auth.username;
export const selectPassword = (state) => state.auth.password;
export default authSlice.reducer;
