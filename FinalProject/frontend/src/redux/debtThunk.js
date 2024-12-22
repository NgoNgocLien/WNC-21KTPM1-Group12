// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { BASE_URL } from './../util/config'
// import { getAccessToken } from './../util/cookie'

// export const fetchIncomingDebts = createAsyncThunk(
//   'debt/fetchIncomingDebts',
//   async (_, { rejectWithValue, getState }) => {
//     const access_token = getAccessToken();

//     try {
//       const response = await fetch(`${BASE_URL}/debts/incoming`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${access_token}`,
//         },
//       });

//       if (!response.ok) {
//         console.log(response)
//         throw new Error('Failed to fetch pending debts');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchOutgoingDebts = createAsyncThunk(
//   'debt/fetchOutgoingDebts',
//   async (_, { rejectWithValue, getState }) => {
//     const access_token = getAccessToken();

//     try {
//       const response = await fetch(`${BASE_URL}/debts/outgoing`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${access_token}`,
//         },
//       });

//       if (!response.ok) {
//         console.log(response)
//         throw new Error('Failed to fetch completed debts');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );