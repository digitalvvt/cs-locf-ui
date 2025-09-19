
import { useState, useCallback } from 'react';
import { AuthState } from './types';

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    superAdminProfile: null,
    loading: true,
    error: null,
    initialized: false,
    isSuperAdmin: false,
  });

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false, initialized: true }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    setState,
    setError,
    clearError,
    updateAuthState
  };
};
