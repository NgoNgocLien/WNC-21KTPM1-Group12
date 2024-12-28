import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchUserAccountInfo, 
  fetchUserContacts, createOneContact, deleteOneContact, updateOneContact } from './userThunk';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'
import notify from '../util/notification';

const initialState = { 
  id: 0,
  fullname: '',
  username: '',
  email: '',
  phone: '',
  account_number: '',
  balance: null,
  contacts: null,
  status: IDLE,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    ...initialState
  },
  reducers: {
    reset: () => {
      return {...initialState}
    },
    resetUserStatus: (state) => {
      return {
        ...state,
        status: IDLE,
        error: null
      }
    },
    setUserStatus: (state,action) => {
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.eror
      }
    }
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
        state.id = action.payload.data.id;
        state.fullname = action.payload.data.fullname;
        state.email = action.payload.data.email;
        state.username = action.payload.data.username;
        state.phone = action.payload.data.phone;
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
        // console.log(action)
        state.status = SUCCEEDED;
        state.contacts = action.payload.data
      })
      .addCase(fetchUserContacts.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createOneContact.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createOneContact.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.contacts = [
          ...state.contacts,
          action.payload.data
        ]
        notify("Thêm mới người nhận thành công");
      })
      .addCase(createOneContact.rejected, (state, action) => {
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
          notify("Chỉnh sửa nickname thành công");
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
        state.contacts = [...filteredContacts];
        notify("Xóa người nhận thành công");
      })
      .addCase(deleteOneContact.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
    }
});

export const { reset, resetUserStatus, setUserStatus } = userSlice.actions;
export default userSlice.reducer;
