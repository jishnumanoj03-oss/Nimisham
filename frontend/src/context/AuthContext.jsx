import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nimisham_token');
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.user);
        } catch {
          localStorage.removeItem('nimisham_token');
          localStorage.removeItem('nimisham_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = useCallback(async (data) => {
    setError(null);
    const response = await authService.register(data);
    localStorage.setItem('nimisham_token', response.data.token);
    localStorage.setItem('nimisham_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response;
  }, []);

  const login = useCallback(async (data) => {
    setError(null);
    const response = await authService.login(data);
    localStorage.setItem('nimisham_token', response.data.token);
    localStorage.setItem('nimisham_user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout even if API call fails
    }
    localStorage.removeItem('nimisham_token');
    localStorage.removeItem('nimisham_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('nimisham_user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
