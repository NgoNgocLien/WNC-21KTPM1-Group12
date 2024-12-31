import { createSlice } from '@reduxjs/toolkit';
import { 
  getCustomerInfo, 
  getCustomerContacts, createOneContact, deleteOneContact, updateOneContact, getCustomers, createCustomer } from './userThunk';
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
  customers: null,
  status: IDLE,
  error: null,
  customerCreationStatus: IDLE,
  customerCreationError: null,
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
      .addCase(getCustomerInfo.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getCustomerInfo.fulfilled, (state, action) => {
        // console.log(action)
        state.status = SUCCEEDED;
        state.id = action.payload.data.id;
        state.fullname = action.payload.data.fullname;
        state.email = action.payload.data.email;
        state.username = action.payload.data.username;
        state.phone = action.payload.data.phone;
        state.account_number = action.payload.data.accounts[0].account_number;
        state.balance = action.payload.data.accounts[0].account_balance;
      })
      .addCase(getCustomerInfo.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(getCustomerContacts.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getCustomerContacts.fulfilled, (state, action) => {
        // console.log(action)
        state.status = SUCCEEDED;
        state.contacts = action.payload.data
      })
      .addCase(getCustomerContacts.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createOneContact.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createOneContact.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        const updatedContacts = [
          ...state.contacts,
          action.payload.data
        ]
        state.contacts = updatedContacts.sort((a, b) => a.nickname.localeCompare(b.nickname));
        notify(action.payload.message);
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
          const updatedContacts = [...state.contacts]
          updatedContacts[updatedContactIndex] = {
            ...state.contacts[updatedContactIndex],
            nickname: action.payload.data.nickname
          };
          state.contacts = updatedContacts.sort((a, b) => a.nickname.localeCompare(b.nickname));
          notify(action.payload.message);
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
        const filteredContacts = state.contacts.filter(contact => contact.id !== action.payload.data.id);
        state.contacts = [...filteredContacts];
        notify(action.payload.message);
      })
      .addCase(deleteOneContact.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(getCustomers.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.customers = action.payload.data;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.customerCreationStatus = LOADING;
        state.customerCreationError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customerCreationStatus = SUCCEEDED;
        notify(action.payload.message);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.customerCreationStatus = FAILED;
        state.customerCreationError = action.payload;
      });
    }
});

export const { reset, resetUserStatus, setUserStatus } = userSlice.actions;
export default userSlice.reducer;
