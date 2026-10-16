import { createSlice } from '@reduxjs/toolkit';
import { loadJSON } from '../../utils/storage';

const saved = loadJSON('ems_registrations', {});

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: {
    byUser: saved,
  },
  reducers: {
    addRegistration(state, action) {
      const { userId, event } = action.payload;
      const current = state.byUser[userId] ?? [];
      const exists = current.some((item) => item.id === event.id);
      if (!exists) {
        state.byUser[userId] = [
          ...current,
          { ...event, registeredAt: new Date().toISOString() },
        ];
      }
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      state.byUser[userId] = (state.byUser[userId] ?? []).filter(
        (event) => event.id !== eventId
      );
    },
  },
});

export const { addRegistration, cancelRegistration } = registrationsSlice.actions;
export const selectMyRegistrations = (state) => {
  const userId = state.auth?.currentUser?.id;
  return userId ? state.registrations.byUser[userId] ?? [] : [];
};

export default registrationsSlice.reducer;
