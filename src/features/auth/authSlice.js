import { createSlice } from '@reduxjs/toolkit';
import { loadJSON } from '../../utils/storage';

const saved = loadJSON('ems_auth', { users: [], currentUser: null });

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: saved.users,             // simulated "database"
    currentUser: saved.currentUser, // { id, name, email } or null
    error: null,
  },
  reducers: {
    registerUser(state, action) {
      const { name, email, password } = action.payload;
      const normalized = email.trim().toLowerCase();
      if (state.users.some((u) => u.email === normalized)) {
        state.error = 'An account with this email already exists';
        return;
      }
      const user = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password };
      state.users.push(user);
      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.error = null;
    },
    loginUser(state, action) {
      const { email, password } = action.payload;
      const user = state.users.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (!user) {
        state.error = 'Invalid email or password';
        return;
      }
      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.error = null;
    },
    logoutUser(state) {
      state.currentUser = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;