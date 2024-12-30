import { createSlice } from '@reduxjs/toolkit';
import { fetchAccountTransactions, fetchBankName } from './transactionThunk';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'

const initialState = {
  transactions: [],
  totalTransactions: 0,
  banks: {},
  status: IDLE,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    ...initialState
  },
  reducers: {
    reset: (state) => {
      return { ...initialState }
    },
    setTransactionStatus: (state,action) => {
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.eror
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchAccountTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.transactions = action.payload.data.transactions;
        state.totalTransactions = action.payload.data.transactions.length;
      })
      .addCase(fetchAccountTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(fetchBankName.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(fetchBankName.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        const { id, name, public_key, logo } = action.payload.data;
        state.banks[id] = { name, public_key, logo };
      })
      .addCase(fetchBankName.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;
