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

export interface UserProfile {
  userId: string;
  internalUserId?: number;
  email: string;
  name?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  profileImageUrl?: string | null;
  role: string;
  roles?: string[];
  isAuthenticated: boolean;
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

export interface AuthExchangeResponse {
  success: boolean;
  message?: string;
  data: {
    isAuthenticated: boolean;
    userId: string;
    internalUserId?: number;
    email: string;
    name?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    profileImageUrl?: string | null;
    role: string;
    roles?: string[];
    accessToken: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    claims?: Array<{
      type: string;
      value: string;
    }>;
  };
  errors?: string[];
}

export interface UserMeResponse {
  success: boolean;
  message?: string;
  data: {
    userId: string;
    email: string;
    name?: string;
    role: string;
    isAuthenticated: boolean;
  };
  errors?: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
