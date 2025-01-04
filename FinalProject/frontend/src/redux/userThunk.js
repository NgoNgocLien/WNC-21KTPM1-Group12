// userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import CustomerService from '../services/CustomerService';
import EmployeeService from '../services/EmployeeService';

export const getUserInfo = createAsyncThunk(
    'user/getCustomerInfo',
    async (role, { rejectWithValue, }) => {  
        try {
          let response = null;
          switch (role){
            case "customer":
              response = await CustomerService.getCustomerInfo();
              return response;
            case "employee":
              response = await EmployeeService.getEmployeeInfo();
              return response;
            case "admin":
              // response = await CustomerService.getCustomerInfo();
              // return response;
            default:
          }
            
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const getCustomerContacts = createAsyncThunk(
    'user/getCustomerContacts',
    async (_, { rejectWithValue, }) => {
        try {
            const response = await CustomerService.getCustomerContacts();
            return response;

        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const createOneContact = createAsyncThunk(
    'user/createOneContact',
    async (values, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const data = {
                id_customer: state.user.id,
                contact_account_number: values.account_number,
                id_bank: values.bank_id,
                nickname: values.nickname,
                contact_fullname: values.contact_fullname
            };
            const response = await CustomerService.createOneContact(data);
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const updateOneContact = createAsyncThunk(
    'user/updateOneContact',
    async (body, { rejectWithValue, getState }) => {  

        try {
            const data = { 
                id: body.id,
                nickname: body.nickname
            }
            const response = await CustomerService.updateOneContact(data);
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const deleteOneContact = createAsyncThunk(
    'user/deleteOneContact',
    async (id, { rejectWithValue, getState }) => {  
        try {
            const data = { 
                id: id,
            }
            const response = await CustomerService.deleteOneContact(data);
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const getCustomers = createAsyncThunk(
    'user/getCustomers',
    async (_, { rejectWithValue }) => {
      try {
        const response = await CustomerService.getCustomers();
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const createCustomer = createAsyncThunk(
    'user/createCustomer',
    async (values, { rejectWithValue }) => {
      try {
        const response = await CustomerService.createCustomer(values); 
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const getEmployees = createAsyncThunk(
    'user/getEmployees',
    async (_, { rejectWithValue }) => {
      try {
        const response = await EmployeeService.getEmployees();
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const createEmployee = createAsyncThunk(
    'user/createEmployee',
    async (values, { rejectWithValue }) => {
      try {
        const response = await EmployeeService.createEmployee(values); 
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const updateEmployee = createAsyncThunk(
    'user/updateEmployee',
    async ({ id, data }, { rejectWithValue }) => {  
      try {
        const response = await EmployeeService.updateEmployee(id, data);
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
  }
);