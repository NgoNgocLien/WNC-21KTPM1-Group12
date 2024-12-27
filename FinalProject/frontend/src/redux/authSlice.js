// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,
    status: null,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      console.log(action.payload)
      state.status = action.payload.status;
      state.error = action.payload.error;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
