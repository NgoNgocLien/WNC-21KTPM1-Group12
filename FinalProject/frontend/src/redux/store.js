import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
import userReducer from './userSlice'
import transactionReducer from './transactionSlice';
import debtReducer from './debtSlice';

const store = configureStore({
  reducer: {
    // auth: authReducer,
    user: userReducer,
    transaction: transactionReducer,
    debt: debtReducer,
  },
});

export default store;
