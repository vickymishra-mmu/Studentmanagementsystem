import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'principal' | 'class_teacher' | 'teacher' | 'librarian' | 'office_worker';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  course?: string;
  class?: string;
  section?: string;
  assignedClass?: string; // For class teachers
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, additionalData?: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string, role: UserRole, additionalData?: any): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        ...additionalData,
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Set current user (without password)
      const userWithoutPassword = { 
        id: newUser.id, 
        name, 
        email, 
        role,
        ...additionalData
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Find user
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (!foundUser) {
        return false;
      }

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}