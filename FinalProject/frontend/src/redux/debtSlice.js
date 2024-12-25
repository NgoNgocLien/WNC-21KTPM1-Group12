import { createSlice } from '@reduxjs/toolkit';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'
import { fetchIncomingDebts, fetchOutgoingDebts, createDebt, cancelDebt, declineDebt } from './debtThunk';
import DebtService from '../services/DebtService';

const initialState = {
  incomingDebts: {
    pending: [],
    completed: []
  },
  outgoingDebts: {
    pending: [],
    completed: []
  },
  status: IDLE,
  error: null,
}

const debtSlice = createSlice({
  name: 'debt',
  initialState: {
    ...initialState
  },
  reducers: {
    reset: (state) => {
      return { ...initialState }
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomingDebts.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchIncomingDebts.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.incomingDebts = action.payload.data;
      })
      .addCase(fetchIncomingDebts.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(fetchOutgoingDebts.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchOutgoingDebts.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.outgoingDebts = action.payload.data;
      })
      .addCase(fetchOutgoingDebts.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createDebt.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createDebt.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.outgoingDebts.pending.push(action.payload.data);
      })
      .addCase(createDebt.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(cancelDebt.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(cancelDebt.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.outgoingDebts = action.payload.data;
      })
      .addCase(cancelDebt.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(declineDebt.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(declineDebt.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.incomingDebts = action.payload.data;
      })
      .addCase(declineDebt.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
  }
})

export const { reset } = debtSlice.actions;
export default debtSlice.reducer;