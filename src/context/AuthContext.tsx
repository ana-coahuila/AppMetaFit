import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('metafit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: 'Usuario Demo',
      email: email,
      age: 35,
      weight: 95,
      height: 170,
      bmi: 32.9,
      weightGoal: 75
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('metafit_user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to register the user
    // For demo purposes, we'll simulate a successful registration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      age: 0, // Will be updated in onboarding
      weight: 0, // Will be updated in onboarding
      height: 0, // Will be updated in onboarding
      bmi: 0, // Will be calculated later
      weightGoal: 0 // Will be set later
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('metafit_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('metafit_user');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      
      // Calculate BMI if weight and height are available
      if (userData.weight && userData.height) {
        const heightInMeters = userData.height / 100;
        const bmi = userData.weight / (heightInMeters * heightInMeters);
        updatedUser.bmi = parseFloat(bmi.toFixed(1));
      }
      
      setUser(updatedUser);
      localStorage.setItem('metafit_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};