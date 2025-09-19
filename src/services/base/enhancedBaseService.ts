
import { useToast } from '@/hooks/use-toast';
import { useEnhancedErrorHandler, DEFAULT_RETRY_CONFIG, ErrorContext, RetryConfig } from '@/services/enhanced-ai/errorHandlingService';

export interface DeadLetterQueueItem {
  id: string;
  operation: string;
  payload: any;
  error: string;
  retryCount: number;
  maxRetries: number;
  lastAttempt: Date;
  nextRetry?: Date;
  status: 'pending' | 'failed' | 'abandoned';
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export interface ServiceOperation<T> {
  operation: () => Promise<T>;
  operationName: string;
  context: ErrorContext;
  retryConfig?: RetryConfig;
  skipCircuitBreaker?: boolean;
}

class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime 
      ? Date.now() - this.lastFailureTime.getTime() > this.config.resetTimeout
      : false;
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }
}

export const useEnhancedBaseService = () => {
  const { toast } = useToast();
  const errorHandler = useEnhancedErrorHandler();
  
  // Circuit breaker instances for different services
  const circuitBreakers = new Map<string, CircuitBreaker>();
  
  // Dead letter queue storage (in-memory for now, would be persisted in production)
  const deadLetterQueue = new Map<string, DeadLetterQueueItem>();

  const getCircuitBreaker = (serviceName: string): CircuitBreaker => {
    if (!circuitBreakers.has(serviceName)) {
      circuitBreakers.set(serviceName, new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute
        monitoringPeriod: 300000 // 5 minutes
      }));
    }
    return circuitBreakers.get(serviceName)!;
  };

  const addToDeadLetterQueue = async (item: Omit<DeadLetterQueueItem, 'id' | 'lastAttempt'>) => {
    const id = crypto.randomUUID();
    const deadLetterItem: DeadLetterQueueItem = {
      ...item,
      id,
      lastAttempt: new Date()
    };
    
    deadLetterQueue.set(id, deadLetterItem);
    
    // In production, this would persist to a database table
    
    return id;
  };

  const executeWithEnhancedHandling = async <T>({
    operation,
    operationName,
    context,
    retryConfig = DEFAULT_RETRY_CONFIG,
    skipCircuitBreaker = false
  }: ServiceOperation<T>): Promise<T> => {
    const circuitBreaker = skipCircuitBreaker ? null : getCircuitBreaker(context.component || 'default');
    
    const wrappedOperation = async () => {
      if (circuitBreaker) {
        return circuitBreaker.execute(operation);
      }
      return operation();
    };

    try {
      return await errorHandler.withRetry(wrappedOperation, retryConfig, context);
    } catch (error) {
      // Add to dead letter queue if all retries failed
      if (retryConfig.maxRetries > 0) {
        await addToDeadLetterQueue({
          operation: operationName,
          payload: context.metadata || {},
          error: error instanceof Error ? error.message : 'Unknown error',
          retryCount: retryConfig.maxRetries,
          maxRetries: retryConfig.maxRetries,
          status: 'failed'
        });
      }
      
      throw error;
    }
  };

  const retryDeadLetterItem = async (itemId: string): Promise<boolean> => {
    const item = deadLetterQueue.get(itemId);
    if (!item || item.status === 'abandoned') {
      return false;
    }

    try {
      // This would need to be implemented based on the specific operation
      // For now, we'll just mark it as pending for manual retry
      item.status = 'pending';
      item.retryCount++;
      item.lastAttempt = new Date();
      
      deadLetterQueue.set(itemId, item);
      return true;
    } catch (error) {
      console.error('Failed to retry dead letter item:', error);
      return false;
    }
  };

  const getDeadLetterQueue = (): DeadLetterQueueItem[] => {
    return Array.from(deadLetterQueue.values());
  };

  const getCircuitBreakerStatus = () => {
    const status = new Map();
    circuitBreakers.forEach((breaker, name) => {
      status.set(name, breaker.getState());
    });
    return status;
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const handleError = (error: any, operation: string, component?: string) => {
    console.error(`Error ${operation}:`, error);
    toast({
      title: "Error",
      description: `Failed to ${operation}`,
      variant: "destructive"
    });
    throw error;
  };

  return {
    executeWithEnhancedHandling,
    handleError,
    handleSuccess,
    addToDeadLetterQueue,
    retryDeadLetterItem,
    getDeadLetterQueue,
    getCircuitBreakerStatus
  };
};
