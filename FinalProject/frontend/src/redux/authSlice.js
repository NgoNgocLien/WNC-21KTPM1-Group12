// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { IDLE } from '../util/config';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,
    status: IDLE,
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
    resetAuthStatus: (state) => {
      return {
        ...state,
        status: IDLE,
        error: null
      }

    }
  },
});

export const { login, logout, resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
