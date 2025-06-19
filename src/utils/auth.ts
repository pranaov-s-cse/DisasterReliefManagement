import { User } from '../contexts/AuthContext';

export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getStoredUser();
};

export const getAuthToken = (): string | null => {
  // In a real app, this would return a JWT token
  return localStorage.getItem('token');
};

export const clearAuth = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};