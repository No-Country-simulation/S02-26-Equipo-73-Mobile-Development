import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/query-client';
import { useAuthStore } from '@/src/stores/auth.store';
import { getToken } from '@/src/utils/secure-storage';
import { validateEnv } from '@/src/config/env';

/**
 * Provider principal de la aplicación
 * Combina React Query y validación de autenticación
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth, setInitialized } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Validar variables de entorno
        validateEnv();

        // Verificar si hay un token guardado
        const token = await getToken();
        
        if (token) {
          // Si hay token, verificar autenticación
          await checkAuth();
        } else {
          // Si no hay token, marcar como inicializado
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error inicializando app:', error);
        setInitialized(true);
      } finally {
        setIsReady(true);
      }
    };

    initialize();
  }, []);

  // Puedes mostrar un splash screen personalizado mientras se inicializa
  if (!isReady) {
    return null; // O un componente de Loading/Splash
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
