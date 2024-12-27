// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,
  },
  reducers: {
    login: (state, action) => {
      console.log(action.payload)
      state.role = action.payload;
    },
    logout: (state) => {
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
