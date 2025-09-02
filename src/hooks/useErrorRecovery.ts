
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorRecoveryState {
  error: Error | null;
  isRecovering: boolean;
  retryCount: number;
  lastRetryAt: Date | null;
}

export interface RecoveryAction {
  label: string;
  action: () => Promise<void> | void;
  primary?: boolean;
}

export const useErrorRecovery = (maxRetries: number = 3) => {
  const { toast } = useToast();
  const [state, setState] = useState<ErrorRecoveryState>({
    error: null,
    isRecovering: false,
    retryCount: 0,
    lastRetryAt: null
  });

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const retry = useCallback(async (operation: () => Promise<void>) => {
    if (state.retryCount >= maxRetries) {
      toast({
        title: "Maximum Retries Exceeded",
        description: "Please refresh the page or contact support if the issue persists.",
        variant: "destructive"
      });
      return false;
    }

    setState(prev => ({ ...prev, isRecovering: true }));

    try {
      await operation();
      setState({
        error: null,
        isRecovering: false,
        retryCount: 0,
        lastRetryAt: null
      });
      
      toast({
        title: "Recovery Successful",
        description: "The operation completed successfully.",
      });
      
      return true;
    } catch (error) {
      setState(prev => ({
        error: error as Error,
        isRecovering: false,
        retryCount: prev.retryCount + 1,
        lastRetryAt: new Date()
      }));
      
      toast({
        title: "Retry Failed",
        description: `Attempt ${state.retryCount + 1} of ${maxRetries} failed. ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.retryCount, maxRetries, toast]);

  const reset = useCallback(() => {
    setState({
      error: null,
      isRecovering: false,
      retryCount: 0,
      lastRetryAt: null
    });
  }, []);

  const canRetry = state.retryCount < maxRetries;

  return {
    state,
    setError,
    retry,
    reset,
    canRetry
  };
};
