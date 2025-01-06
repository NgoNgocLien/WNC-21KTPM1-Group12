import { createSlice } from '@reduxjs/toolkit';
import { getAccountTransactions, getBankName, getCustomerTransactions, getExternalTransactions } from './transactionThunk';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'

const initialState = {
  transactions: [],
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
    reset: () => {
      return { ...initialState }
    },
    setTransactionStatus: (state,action) => {
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.error
      }
    },
    resetTransactionStatus: (state) => {
      return {
        ...state,
        status: IDLE,
        error: null
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getAccountTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.transactions = action.payload.data.transactions;
      })
      .addCase(getAccountTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(getBankName.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getBankName.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        const { id, name, public_key, logo } = action.payload.data;
        state.banks[id] = { name, public_key, logo };
      })
      .addCase(getBankName.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(getCustomerTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getCustomerTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.transactions = action.payload.data.transactions;
      })
      .addCase(getCustomerTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(getExternalTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getExternalTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.transactions = action.payload.data;
      })
      .addCase(getExternalTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export const { reset, resetTransactionStatus, setTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;
