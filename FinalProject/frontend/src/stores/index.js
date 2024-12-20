import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlide';
import userReducer from './userSlide'

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
});

export default store;
