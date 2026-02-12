/**
 * Tipos relacionados con autenticación
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string;
  };
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string;
  };
  message?: string;
}
