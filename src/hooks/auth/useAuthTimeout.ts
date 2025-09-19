
import { useRef, useCallback } from 'react';

export const useAuthTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const authCompletedRef = useRef(false);

  const clearAuthTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const setAuthCompleted = useCallback((completed: boolean) => {
    authCompletedRef.current = completed;
  }, []);

  const startAuthTimeout = useCallback((onTimeout: () => void, timeoutMs: number = 15000) => {
    timeoutRef.current = setTimeout(() => {
      if (!authCompletedRef.current) {
        onTimeout();
      }
    }, timeoutMs);
  }, []);

  const cleanup = useCallback(() => {
    authCompletedRef.current = false;
    clearAuthTimeout();
  }, [clearAuthTimeout]);

  return {
    clearAuthTimeout,
    setAuthCompleted,
    startAuthTimeout,
    cleanup,
    isAuthCompleted: () => authCompletedRef.current
  };
};
