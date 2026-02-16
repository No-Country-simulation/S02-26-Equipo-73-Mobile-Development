import { create } from 'zustand';
import type { AuthUser, LoginCredentials, RegisterData } from '@/src/types/auth.types';
import { supabase } from '@/src/lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthState {
  // Estado
  user: AuthUser | null;
  session: Session | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Acciones
  initialize: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  fetchProfile: (userId: string) => Promise<void>;
  clearError: () => void;
  setInitialized: (value: boolean) => void;
}

/**
 * Store de autenticación con Supabase
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Estado inicial
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  /**
   * Inicializar el store y configurar listener de Supabase
   * Debe llamarse una sola vez al inicio de la app
   */
  initialize: () => {
    // Configurar listener de cambios de autenticación
    supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        };

        set({
          session,
          user,
          isAuthenticated: true,
        });

        // Cargar perfil si existe tabla profiles
        await get().fetchProfile(session.user.id);
      } else {
        set({
          session: null,
          user: null,
          profile: null,
          isAuthenticated: false,
        });
      }
    });
  },

  /**
   * Cargar perfil desde la tabla profiles (opcional)
   */
  fetchProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = No rows found (ignorar si no existe la tabla)
        console.error('Error fetching profile:', error);
        return;
      }

      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  /**
   * Iniciar sesión con Supabase
   */
  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          avatar: data.user.user_metadata?.avatar_url,
        };

        set({
          session: data.session,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Cargar perfil
        await get().fetchProfile(data.user.id);
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Error al iniciar sesión',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Registrar nuevo usuario con Supabase
   */
  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true, error: null });

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || null,
          },
          emailRedirectTo: 'equiapp://auth/callback',
        },
      });
      console.log('Registro:', authData, error);

      if (error) throw error;

      if (authData.user && authData.session) {
        const user: AuthUser = {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          avatar: authData.user.user_metadata?.avatar_url,
        };

        set({
          session: authData.session,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Cargar perfil
        await get().fetchProfile(authData.user.id);
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Error al registrarse',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Cerrar sesión con Supabase
   */
  logout: async () => {
    try {
      await supabase.auth.signOut();

      set({
        session: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error en logout:', error);
      // Limpiar estado de todas formas
      set({
        session: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Verificar autenticación (al iniciar la app)
   */
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        };

        set({
          session,
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });

        // Cargar perfil
        await get().fetchProfile(session.user.id);
      } else {
        set({
          session: null,
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      set({
        session: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  /**
   * Actualizar datos del usuario
   */
  updateUser: async (userData: Partial<AuthUser>) => {
    const currentUser = get().user;
    if (currentUser) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            name: userData.name,
            avatar_url: userData.avatar,
          },
        });

        if (error) throw error;

        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
      }
    }
  },

  /**
   * Limpiar error
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Marcar como inicializado
   */
  setInitialized: (value: boolean) => {
    set({ isInitialized: value });
  },
}));
