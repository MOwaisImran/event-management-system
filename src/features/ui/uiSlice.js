import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null }, // { id, message, type: 'success' | 'error' | 'info' }
  reducers: {
    showToast(state, action) {
      state.toast = { id: Date.now(), ...action.payload };
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;