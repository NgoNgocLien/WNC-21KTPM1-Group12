import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from './../util/config'
import { getAccessToken } from './../util/cookie'

export const fetchAccountTransactions = createAsyncThunk(
    'transaction/fetchAccountTransactions',
    async (_, { rejectWithValue, getState }) => {
        const access_token = getAccessToken(); 

        try {
            const response = await fetch(`${BASE_URL}/transactions/account`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                console.log(response)
                throw new Error('Failed to fetch account transaction');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const fetchBankName = createAsyncThunk(
    'transaction/fetchBankName',
    async (id_bank, { rejectWithValue, getState }) => {
        const access_token = getAccessToken(); 

        try {
            const response = await fetch(`${BASE_URL}/transactions/bank/${id_bank}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                console.log(response)
                throw new Error('Failed to fetch bank info');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);
