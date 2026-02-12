/**
 * Tipos relacionados con el usuario
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller',
}

export interface UserProfile extends User {
  address?: Address;
  preferences?: UserPreferences;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UserPreferences {
  notifications?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

export interface UpdateProfileData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  preferences?: UserPreferences;
}
