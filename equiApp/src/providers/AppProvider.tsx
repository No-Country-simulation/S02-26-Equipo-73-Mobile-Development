import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/query-client';
import { useAuthStore } from '@/src/stores/auth.store';
import { validateEnv } from '@/src/config/env';

/**
 * Provider principal de la aplicación
 * Combina React Query y autenticación con Supabase (Zustand)
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialize, checkAuth, setInitialized } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Validar variables de entorno
        validateEnv();

        // Inicializar listener de Supabase
        initialize();

        // Verificar autenticación actual
        await checkAuth();
      } catch (error) {
        console.error('Error inicializando app:', error);
        setInitialized(true);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
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
