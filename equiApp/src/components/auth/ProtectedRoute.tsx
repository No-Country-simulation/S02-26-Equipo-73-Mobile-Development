import { useAuth } from '@/src/hooks';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige al login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

/**
 * Componente para rutas públicas (cuando ya está autenticado, redirige al home)
 * Útil para pantallas de login/register
 */
export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  // Si ya está autenticado, redirigir al home
  if (isInitialized && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
};

/**
 * HOC para proteger rutas
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
