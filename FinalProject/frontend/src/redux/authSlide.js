// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: true,
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiam9obl9kb2UiLCJpYXQiOjE3MzQxNjgzMDUsImV4cCI6MTc0MjgwODMwNX0.w9PxbriWHNfY5jiuoYCvprMtFmTQUwL3JUtPR3kxrIY",
  },
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;

    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.access_token = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
