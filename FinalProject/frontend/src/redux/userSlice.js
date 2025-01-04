import { createSlice } from '@reduxjs/toolkit';
import { 
  getUserInfo, 
  getCustomerContacts, createOneContact, deleteOneContact, updateOneContact, getCustomers, createCustomer, 
  getEmployees, createEmployee, updateEmployee} from './userThunk';
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
  employees: null,
  status: IDLE,
  error: null,
  customerStatus: IDLE,
  customerError: null,
  employeeStatus: IDLE,
  employeeError: null,
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
        error: action.payload.error
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        // console.log(action)
        state.status = SUCCEEDED;
        state.id = action.payload.data.id;
        state.fullname = action.payload.data.fullname;
        state.email = action.payload.data.email;
        state.username = action.payload.data.username;
        state.phone = action.payload.data.phone;
        if (action.payload.data?.accounts?.length > 0){
          state.account_number = action.payload.data.accounts[0].account_number;
          state.balance = action.payload.data?.accounts[0].account_balance;
        }
      })
      .addCase(getUserInfo.rejected, (state, action) => {
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
        state.customerStatus = LOADING;
        state.customerError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customerStatus = SUCCEEDED;
        state.customers.push(action.payload.data);
        notify(action.payload.message);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.customerStatus = FAILED;
        state.customerError = action.payload;
      })
      .addCase(getEmployees.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.employees = action.payload.data;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, (state) => {
        state.employeeStatus = LOADING;
        state.employeeError = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employeeStatus = SUCCEEDED;
        state.employees.push(action.payload.data);
        notify(action.payload.message);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.employeeStatus = FAILED;
        state.employeeError = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.employeeStatus = LOADING;
        state.employeeError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employeeStatus = SUCCEEDED;
        const updatedEmployeeIndex = state.employees.findIndex(
          (employee) => employee.id === action.payload.data.id
        );
        if (updatedEmployeeIndex !== -1) {
          const updatedEmployees = [...state.employees];
          updatedEmployees[updatedEmployeeIndex] = action.payload.data;  
          state.employees = updatedEmployees; 
        }
        notify(action.payload.message);
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.employeeStatus = FAILED;
        state.employeeError = action.payload;
      });
    }
});

export const { reset, resetUserStatus, setUserStatus } = userSlice.actions;
export default userSlice.reducer;
