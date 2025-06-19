import { User, RegisterData } from '../contexts/AuthContext';

// Mock user database
const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tndrm.gov.in',
    role: 'admin',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
    },
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
    },
  },
];

// Simulate login API
export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const user = users.find((u) => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, we would verify the password here
  if (password.length < 6) {
    throw new Error('Invalid password');
  }
  
  return user;
};

// Simulate register API
export const mockRegister = async (userData: RegisterData): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (users.some((u) => u.email === userData.email)) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    name: userData.name,
    email: userData.email,
    role: 'user', // Default role
    location: {
      district: userData.district,
      coordinates: [userData.latitude, userData.longitude],
    },
  };
  
  // In a real app, we would hash the password and store in database
  users.push(newUser);
  
  return newUser;
};