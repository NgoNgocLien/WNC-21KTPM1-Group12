import { createSlice } from '@reduxjs/toolkit';
import { createExternalTransactions, createInternalTransactions, getAccountTransactions, getBanks, getCustomerTransactions, getExternalTransactions } from './transactionThunk';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../util/config'

const initialState = {
  transactions: null,
  banks: null,
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
      .addCase(getBanks.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getBanks.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.banks = action.payload.data.map(bank => ({
          id: bank.id,
          name: bank.name,
          logo: bank.logo
        }));
      })
      .addCase(getBanks.rejected, (state, action) => {
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
      })
      .addCase(createInternalTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createInternalTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        console.log(action.payload.data)

        state.transactions = [
          action.payload.data,
          ...state.transactions,
        ]
      })
      .addCase(createInternalTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      })
      .addCase(createExternalTransactions.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createExternalTransactions.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        console.log(action.payload.data)
        state.transactions = [
          action.payload.data,
          ...state.transactions,
        ]
      })
      .addCase(createExternalTransactions.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export const { reset, resetTransactionStatus, setTransactionStatus } = transactionSlice.actions;
export default transactionSlice.reducer;
