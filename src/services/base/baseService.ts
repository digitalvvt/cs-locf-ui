
import { useToast } from '@/hooks/use-toast';

export const useBaseService = () => {
  const { toast } = useToast();

  const handleError = (error: any, operation: string) => {
    console.error(`Error ${operation}:`, error);
    toast({
      title: "Error",
      description: `Failed to ${operation}`,
      variant: "destructive"
    });
    throw error;
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  return {
    handleError,
    handleSuccess
  };
};
