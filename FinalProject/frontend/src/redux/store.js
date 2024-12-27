import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice'
import transactionReducer from './transactionSlice';
import debtReducer from './debtSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    transaction: transactionReducer,
    debt: debtReducer,
    notification: notificationReducer,
  },
});

export default store;
