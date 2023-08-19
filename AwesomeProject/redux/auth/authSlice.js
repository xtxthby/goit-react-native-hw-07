import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "null",
  login: "null",
  email: "null",
  password: "null",
  stateChange: "null",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile(state, { payload }) {
      console.log(payload);
      state.userId = payload.userId;
      state.login = payload.login;
      state.email = payload.email;
    },
    authStateChange(state, { payload }) {
      state.stateChange = payload.stateChange;
    },
    authSignOut(state) {
      state.userId = null;
      state.login = null;
      state.email = null;
      state.stateChange = false;
    },
  },
});
export const { updateUserProfile, authStateChange, authSignOut } =
  authSlice.actions;
export default authSlice.reducer;