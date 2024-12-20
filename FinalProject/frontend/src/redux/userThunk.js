// userThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from './../util/config'

export const fetchUserAccountInfo = createAsyncThunk(
    'user/fetchUserAccountInfo',
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
        const access_token = state.auth.access_token; 
  
        try {
            const response = await fetch(`${BASE_URL}/customers/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, 
            },
            });
    
            if (!response.ok) {
                console.log(response)
            throw new Error('Failed to fetch user account info');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const fetchUserContacts = createAsyncThunk(
    'user/fetchUserContacts',
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
        const access_token = state.auth.access_token; 
  
        try {
            const response = await fetch(`${BASE_URL}/customers/contacts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, 
            },
            });
    
            if (!response.ok) {
                console.log(response)
            throw new Error('Failed to fetch user account info');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);
