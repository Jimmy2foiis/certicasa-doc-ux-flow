
/**
 * Hook unifié pour utiliser le client API
 */
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/services/api/apiClient';

interface UseApiClientOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export const useApiClient = <T = any>(options: UseApiClientOptions = {}) => {
  const { toast } = useToast();
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Opération réussie'
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success && response.data) {
        setData(response.data);
        
        if (showSuccessToast) {
          toast({
            title: 'Succès',
            description: successMessage,
          });
        }
        
        return response.data;
      } else {
        const errorMessage = response.error || 'Erreur inconnue';
        setError(errorMessage);
        
        if (showErrorToast) {
          toast({
            title: 'Erreur',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inattendue';
      setError(errorMessage);
      
      if (showErrorToast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, showSuccessToast, showErrorToast, successMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};
