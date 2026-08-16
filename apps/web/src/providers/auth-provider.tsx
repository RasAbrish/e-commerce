'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthStore, type User } from '../stores/auth-store';
import { fetchApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setAuth, logout: storeLogout, isAuthenticated, isAdmin } = useAuthStore();

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    if (stored && token && refreshToken) {
      try {
        const parsedUser = JSON.parse(stored);
        setAuth(parsedUser, token, refreshToken);
      } catch {
        storeLogout();
      }
    }
    setIsLoading(false);
  }, [setAuth, storeLogout]);

  const login = async (email: string, password: string) => {
    const result = await fetchApi<{ user: User; accessToken: string; refreshToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken, result.data.refreshToken);
      return { success: true };
    }

    return { success: false, error: result.error || 'Login failed' };
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const result = await fetchApi<{ user: User; accessToken: string; refreshToken: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken, result.data.refreshToken);
      return { success: true };
    }

    return { success: false, error: result.error || 'Registration failed' };
  };

  const logout = () => {
    // Call API to invalidate refresh token
    fetchApi('/api/auth/logout', { method: 'POST' }).catch(() => {});
    storeLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: isAuthenticated(),
        isAdmin: isAdmin(),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
