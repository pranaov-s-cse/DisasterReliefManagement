import { create } from 'zustand';
import { mockLogin, mockRegister } from '../api/mockAuth';
import { User, RegisterData } from '../contexts/AuthContext';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await mockLogin(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await mockRegister(userData);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  }
}));