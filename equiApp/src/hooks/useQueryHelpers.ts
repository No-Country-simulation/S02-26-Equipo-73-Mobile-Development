import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { handleApiError, type ApiError } from '@/src/config/api';

interface UseMutationWithFeedbackOptions<TData, TVariables> 
  extends Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string;
  showSuccessAlert?: boolean;
  showErrorAlert?: boolean;
}

/**
 * Hook personalizado para mutaciones con feedback automático
 * Muestra alertas de éxito/error automáticamente
 */
export const useMutationWithFeedback = <TData = unknown, TVariables = void>({
  mutationFn,
  successMessage = 'Operación exitosa',
  errorMessage = 'Ocurrió un error',
  showSuccessAlert = true,
  showErrorAlert = true,
  onSuccess,
  onError,
  ...options
}: UseMutationWithFeedbackOptions<TData, TVariables>) => {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context, meta) => {
      if (showSuccessAlert) {
        Alert.alert('Éxito', successMessage);
      }
      onSuccess?.(data, variables, context, meta);
    },
    onError: (error, variables, context, meta) => {
      const apiError = handleApiError(error);
      if (showErrorAlert) {
        Alert.alert('Error', apiError.message || errorMessage);
      }
      onError?.(apiError, variables, context, meta);
    },
    ...options,
  });
};

/**
 * Hook para obtener el estado de múltiples queries
 */
export const useMultipleQueries = (queries: any[]) => {
  const isLoading = queries.some(q => q.isLoading);
  const isError = queries.some(q => q.isError);
  const isSuccess = queries.every(q => q.isSuccess);

  return {
    isLoading,
    isError,
    isSuccess,
    queries,
  };
};
