import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';
import uiReducer from '../features/ui/uiSlice';
import { saveJSON } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
});

// Persist to localStorage only when the relevant slice actually changed
let prevAuth = store.getState().auth;
let prevRegs = store.getState().registrations;

store.subscribe(() => {
  const { auth, registrations } = store.getState();
  if (auth !== prevAuth) {
    prevAuth = auth;
    saveJSON('ems_auth', { users: auth.users, currentUser: auth.currentUser });
  }
  if (registrations !== prevRegs) {
    prevRegs = registrations;
    saveJSON('ems_registrations', registrations.byUser);
  }
});