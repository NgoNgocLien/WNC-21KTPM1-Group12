import { createAsyncThunk } from '@reduxjs/toolkit';
import TransactionService from '../services/TransactionService';

export const getAccountTransactions = createAsyncThunk(
    'transaction/getAccountTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TransactionService.getAccountTransactions();
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const getBanks = createAsyncThunk(
    'transaction/getBanks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TransactionService.getBanks();
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const getCustomerTransactions = createAsyncThunk(
    'transaction/getCustomerTransactions',
    async (account_number, { rejectWithValue }) => {
        try {
            const response = await TransactionService.getCustomerTransactions(account_number);
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const getExternalTransactions = createAsyncThunk(
    'transaction/getExternalTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TransactionService.getExternalTransactions();
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const createInternalTransactions = createAsyncThunk(
    'transaction/createInternalTransactions',
    async ({ data, handleSuccessfulTransaction }, { rejectWithValue }) => {
        try {
            console.log(data)
            const response = await TransactionService.createInternalTransactions(data);
            handleSuccessfulTransaction(response.data)
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const createExternalTransactions = createAsyncThunk(
    'transaction/createExternalTransactions',
    async ({ data, handleSuccessfulTransaction }, { rejectWithValue }) => {
        try {
            const response = await TransactionService.createExternalTransactions(data);
            handleSuccessfulTransaction(response.data)
            return response;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);