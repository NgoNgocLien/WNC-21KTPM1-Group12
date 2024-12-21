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

export const createOneContact = createAsyncThunk(
    'user/createOneContact',
    async (values, { rejectWithValue, getState }) => {
        const state = getState();
        const access_token = state.auth.access_token; 
        console.log({
            id_customer: state.user.id,
            contact_account_number: values.account_number,
            id_bank: values.bank_id,
            nickname: values.nickname,
            contact_fullname: values.contact_fullname
        })
        try {
            const response = await fetch(`${BASE_URL}/customers/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, 
            },
            body: JSON.stringify({
                id_customer: state.user.id,
                contact_account_number: values.account_number,
                id_bank: values.bank_id,
                nickname: values.nickname,
                contact_fullname: values.contact_fullname
            })
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

export const updateOneContact = createAsyncThunk(
    'user/updateOneContact',
    async (body, { rejectWithValue, getState }) => {
        const state = getState();
        const access_token = state.auth.access_token; 
  
        try {
            const response = await fetch(`${BASE_URL}/customers/contacts`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, 
            },
            body: JSON.stringify({ 
                id: body.id,
                nickname: body.nickname
            })
            });
    
            if (!response.ok) {
                console.log(response)
            throw new Error('Failed to fetch user account info');
            }
    
            const data = await response.json();
            return {data: body, message: data.message};
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const deleteOneContact = createAsyncThunk(
    'user/deleteOneContact',
    async (id, { rejectWithValue, getState }) => {
        const state = getState();
        const access_token = state.auth.access_token; 
  
        try {
            const response = await fetch(`${BASE_URL}/customers/contacts`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, 
            },
            body: JSON.stringify({ id: id })
            });
    
            if (!response.ok) {
                console.log(response)
            throw new Error('Failed to fetch user account info');
            }
    
            const data = await response.json();
            return { id, message: data.message };
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);
