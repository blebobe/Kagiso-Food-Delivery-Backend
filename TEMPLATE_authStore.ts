// Auth Store - Copy to: src/stores/authStore.ts
// Location: All three apps

import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'driver';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
}

const initialUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null;
const initialToken = localStorage.getItem('token') || null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isLoading: false,

  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  isAuthenticated: () => get().token !== null,
}));
