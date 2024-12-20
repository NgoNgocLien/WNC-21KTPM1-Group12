import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    fullname: 'NGÔ NGỌC LIÊN',
    account_number: '0000000000',
    balance: 0,
    contacts: [{
      nickname: "aaaa",
      account_number: "aaaa",
      bank_name: "NoMeoBank",
      bank_avatar: "aaaa",
      fullname: "aaaa",
    },
    {
      nickname: "bbbb",
      account_number: "00000001",
      bank_name: "NoMeoBank",
      bank_avatar: "",
      fullname: "B B b b",
    },
    {
      nickname: "aaaa",
      account_number: "aaa1",
      bank_name: "NoMeoBank",
      bank_avatar: "aaaa",
      fullname: "aaaa",
    },
    {
      nickname: "bbbb",
      account_number: "00000002",
      bank_name: "NoMeoBank",
      bank_avatar: "",
      fullname: "B B b b",
    },
    {
      nickname: "aaaa",
      account_number: "aaa2",
      bank_name: "NoMeoBank",
      bank_avatar: "aaaa",
      fullname: "aaaa",
    },
    {
      nickname: "bbbb",
      account_number: "00000003",
      bank_name: "NoMeoBank",
      bank_avatar: "",
      fullname: "B B b b",
    },
    {
      nickname: "aaaa",
      account_number: "aaa3",
      bank_name: "MeoBank",
      bank_avatar: "aaaa",
      fullname: "aaaa",
    },
    {
      nickname: "bbbb",
      account_number: "00000004",
      bank_name: "MeoBank",
      bank_avatar: "",
      fullname: "B B b b",
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
