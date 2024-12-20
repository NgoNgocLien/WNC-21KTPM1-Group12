import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    fullname: 'NGÔ NGỌC LIÊN',
    account_number: '0000000000'
  },
  reducers: {
    reset: (state) => {
      state.fullname = null;
      state.account_number = null;
    },
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
