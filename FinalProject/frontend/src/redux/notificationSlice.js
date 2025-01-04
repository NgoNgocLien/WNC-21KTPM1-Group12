import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [
  ],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification: (state) => {
      state.notifications = state.notifications.slice(1); // Remove the first notification
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;