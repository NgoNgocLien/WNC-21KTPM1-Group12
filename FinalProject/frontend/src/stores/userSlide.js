import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    fullname: 'NGÔ NGỌC LIÊN',
    account_number: '0000000000',
    balance: 0,
    contacts: [{
      
    }]
  },
  reducers: {
    reset: (state) => {
      state.fullname = null;
      state.account_number = null;
      state.balance = null;
      state.contacts = [];
    },
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
