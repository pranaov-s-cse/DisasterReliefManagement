import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getStoredUser } from '../utils/auth';

type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  location?: {
    district: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  district: string;
  latitude: number;
  longitude: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
    isAuthenticated,
    user,
    isLoading,
    setUser,
  } = useAuthStore();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        login: loginAction,
        register: registerAction,
        logout: logoutAction,
        isAuthenticated,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};