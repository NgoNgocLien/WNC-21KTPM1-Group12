import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: '', // error, info, confirm
  message: '',
  actionBtn: false,
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.actionBtn = action.payload.actionBtn || false;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;