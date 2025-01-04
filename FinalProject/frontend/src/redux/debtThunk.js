import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from './../util/config'
import { getAccessToken } from './../util/cookie'
import DebtService from '../services/DebtService';

export const fetchIncomingDebts = createAsyncThunk(
  'debt/fetchIncomingDebts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await DebtService.getIncomingDebts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOutgoingDebts = createAsyncThunk(
  'debt/fetchOutgoingDebts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await DebtService.getOutgoingDebts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDebt = createAsyncThunk(
  'debt/createDebt',
  async (data, { rejectWithValue, getState }) => {
    try {
      await DebtService.createDebt(data);
      const response = await DebtService.getOutgoingDebts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const payDebt = createAsyncThunk(
  'debt/payDebt',
  async ({ id_debt, data }, { rejectWithValue, getState }) => {
    try {
      await DebtService.payDebt(id_debt, data);
      const response = await DebtService.getIncomingDebts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelDebt = createAsyncThunk(
  'debt/cancelDebt',
  async ({ id_debt, data }, { rejectWithValue, getState }) => {
    try {
      await DebtService.cancelDebt(id_debt, data);
      const response = await DebtService.getOutgoingDebts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const declineDebt = createAsyncThunk(
  'debt/declineDebt',
  async ({ id_debt, data }, { rejectWithValue, getState }) => {
    try {
      await DebtService.declineDebt(id_debt, data);
      const response = await DebtService.getIncomingDebts(); // Lấy danh sách mới
      return response; // Trả về danh sách mới
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);