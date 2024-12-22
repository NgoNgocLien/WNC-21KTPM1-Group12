// import { createSlice } from '@reduxjs/toolkit';
// import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'
// import { fetchIncomingDebts, fetchOutgoingDebts, fetchPendingDebts } from './debtThunk';

// const initialState = {
//   incomingDebts: {
//   },
//   outgoingDebts: {
//   },
//   status: IDLE,
//   error: null,
// }

// const debtSlice = createSlice({
//   name: 'debt',
//   initialState: {
//     ...initialState
//   },
//   reducers: {
//     reset: (state) => {
//       return { ...initialState }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchIncomingDebts.pending, (state) => {
//         state.status = LOADING;
//         state.error = null;
//       })
//       .addCase(fetchIncomingDebts.fulfilled, (state, action) => {
//         state.status = SUCCEEDED;
//         state.incomingDebts = action.payload.data;
//       })
//       .addCase(fetchIncomingDebts.rejected, (state, action) => {
//         state.status = FAILED;
//         state.error = action.payload;
//       })
//       .addCase(fetchOutgoingDebts.pending, (state) => {
//         state.status = LOADING;
//         state.error = null;
//       })
//       .addCase(fetchOutgoingDebts.fulfilled, (state, action) => {
//         state.status = SUCCEEDED;
//         state.outgoingDebts = action.payload.data;
//       })
//       .addCase(fetchOutgoingDebts.rejected, (state, action) => {
//         state.status = FAILED;
//         state.error = action.payload;
//       });
//   }
// })

// export const { reset } = debtSlice.actions;
// export default debtSlice.reducer;