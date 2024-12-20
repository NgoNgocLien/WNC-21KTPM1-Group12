import { createSlice } from '@reduxjs/toolkit';
import { fetchUserAccountInfo, fetchUserContacts, deleteOneContact, updateOneContact } from './userThunk';
import { IDLE, LOADING, SUCCEEDED, FAILED } from './../util/config'

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    fullname: '',
    account_number: '',
    balance: 0,
    contacts: [],
    status: IDLE,
    error: null,
  },
  reducers: {
    setUserAccountInfo: (state, action) => {
      state.fullname = action.payload.fullname;
      state.account_number = action.payload.account_number;
      state.balance = action.payload.balance;
    },
    reset: (state) => {
      state.fullname = '';
      state.account_number = '';
      state.balance = 0;
      state.contacts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAccountInfo.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchUserAccountInfo.fulfilled, (state, action) => {
        console.log(action)
        state.status = SUCCEEDED;
        state.fullname = action.payload.data.fullname;
        state.account_number = action.payload.data.accounts[0].account_number;
        state.balance = action.payload.data.accounts[0].account_balance;
      })
      .addCase(fetchUserAccountInfo.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(fetchUserContacts.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchUserContacts.fulfilled, (state, action) => {
        console.log(action)
        state.status = SUCCEEDED;
        state.contacts = action.payload.data
      })
      .addCase(fetchUserContacts.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(updateOneContact.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(updateOneContact.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        const updatedContactIndex = state.contacts.findIndex(
          (contact) => contact.id === action.payload.data.id
        );
        if (updatedContactIndex !== -1) {
          state.contacts[updatedContactIndex] = {
            ...state.contacts[updatedContactIndex],
            nickname: action.payload.data.nickname
          };
        }
      })
      .addCase(updateOneContact.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(deleteOneContact.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(deleteOneContact.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        const filteredContacts = state.contacts.filter(contact => contact.id !== action.payload.id);
        state.contacts = [...filteredContacts]
      })
      .addCase(deleteOneContact.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
    }
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
