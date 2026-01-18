import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'splitwise-auth-users';
const STORAGE_KEY_CURRENT_USER = 'splitwise-auth-current-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const getUsers = (): User[] => {
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    return savedUsers ? JSON.parse(savedUsers) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  };

  const findUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find((u: User) => u.email === email);
  };

  const signup = (name: string, email: string, password: string): boolean => {
    // Check if user already exists
    if (findUserByEmail(email)) {
      return false;
    }

    // Create new user (in real app, you'd hash the password)
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
    };

    // Save user with password (stored as password_hash for simulation)
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    // Store password separately (in real app, this would be in a secure database)
    const passwords = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS + '_passwords') || '{}');
    passwords[newUser.id] = password;
    localStorage.setItem(STORAGE_KEY_USERS + '_passwords', JSON.stringify(passwords));

    // Auto login after signup
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newUser));

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const existingUser = findUserByEmail(email);

    if (!existingUser) {
      return false;
    }

    // Verify password
    const passwords = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS + '_passwords') || '{}');
    if (passwords[existingUser.id] !== password) {
      return false;
    }

    // Set user session
    setUser(existingUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(existingUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
