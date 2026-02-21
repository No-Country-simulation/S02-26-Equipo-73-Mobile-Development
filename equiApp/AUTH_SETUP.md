# EquiApp - Configuración de Autenticación con Supabase

Sistema completo de autenticación con **Supabase** y manejo de estado para React Native con Expo.

## 📦 Librerías Instaladas

- **@supabase/supabase-js** - Cliente de Supabase
- **expo-secure-store** - Almacenamiento seguro de sesiones
- **@tanstack/react-query** - Gestión de estado del servidor
- **zod** - Validación de schemas
- **react-hook-form** - Manejo de formularios
- **zustand** - Gestión de estado global
- **@react-native-async-storage/async-storage** - Almacenamiento persistente

## 🏗️ Estructura del Proyecto

```
src/
├── lib/
│   └── supabase.ts         # Cliente de Supabase configurado
├── config/
│   ├── env.ts              # Variables de entorno
│   ├── api.ts              # Cliente Axios (opcional para backend custom)
│   └── query-client.ts     # Configuración de React Query
├── stores/
│   ├── auth.store.ts       # Store de autenticación (Zustand + Supabase)
│   └── user.store.ts       # Store de usuario (Zustand)
├── hooks/
│   ├── useAuth.ts          # Hook de autenticación
│   └── useUser.ts          # Hook de usuario
├── providers/
│   └── AppProvider.tsx     # Provider principal de la app
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx  # Componente para proteger rutas
│       └── index.ts
├── schemas/
│   └── auth.schema.ts      # Validaciones con Zod
├── types/
│   ├── auth.types.ts       # Tipos de autenticación
│   └── user.types.ts       # Tipos de usuario
├── services/
│   └── products.service.ts # Ejemplo de servicio con React Query
└── index.ts                # Exportaciones centrales
```

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [Supabase](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings** > **API**
4. Copia la **Project URL** y **anon/public key**

### 2. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Supabase Configuration (REQUERIDO)
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# API Configuration (opcional para backend custom)
EXPO_PUBLIC_API_URL=https://tu-api.com/api
```

### 3. Configuración de TypeScript

El alias `@/*` ya está configurado en `tsconfig.json` para apuntar a la raíz del proyecto.

## 📱 Uso

### Autenticación con Supabase

#### Login
```tsx
import { useAuth } from '@/src/hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ 
        email: 'user@example.com', 
        password: '123456' 
      });
      // Redirigir al usuario
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
}
```

#### Registro
```tsx
const { register } = useAuth();

try {
  await register({
    email: 'user@example.com',
    password: '123456',
    confirmPassword: '123456',
    name: 'Usuario'
  });
  Alert.alert('Éxito', 'Revisa tu email para confirmar tu cuenta');
} catch (error: any) {
  Alert.alert('Error', error.message);
}
```

#### Recuperar Contraseña
```tsx
import { supabase } from '@/src/lib/supabase';

const handleForgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'equiapp://reset-password',
  });
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Éxito', 'Revisa tu email para restablecer tu contraseña');
  }
};
```

#### Logout
```tsx
const { logout } = useAuth();

await logout();
```

#### Verificar Autenticación
```tsx
const { isAuthenticated, user, isInitialized } = useAuth();

if (!isInitialized) {
  return <Loading />;
}

if (isAuthenticated) {
  return <DashboardScreen />;
}
```

### Protección de Rutas

#### Opción 1: Usando Componente
```tsx
import { ProtectedRoute } from '@/src/components/auth';

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
```

#### Opción 2: Usando HOC
```tsx
import { withAuth } from '@/src/components/auth';

function ProfileScreen() {
  return <View>...</View>;
}

export default withAuth(ProfileScreen);
```

#### Rutas Públicas
```tsx
import { PublicRoute } from '@/src/components/auth';

// Si el usuario ya está autenticado, redirige al home
export default function LoginScreen() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
```

### React Query

#### Consultas (Queries)
```tsx
import { useProducts } from '@/src/services/products.service';

function ProductsScreen() {
  const { data, isLoading, error, refetch } = useProducts({ 
    category: 'electronics' 
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <ProductList products={data} />;
}
```

#### Mutaciones (Mutations)
```tsx
import { useCreateProduct } from '@/src/services/products.service';

function CreateProductScreen() {
  const { mutate, isPending } = useCreateProduct();

  const handleCreate = () => {
    mutate({
      name: 'Producto',
      price: 100,
      description: 'Descripción'
    }, {
      onSuccess: () => {
        Alert.alert('Éxito', 'Producto creado');
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      }
    });
  };
}
```

### Formularios con React Hook Form y Zod

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/src/schemas/auth.schema';

function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data); // Datos validados
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
        />
      )}
    />
  );
}
```

### Zustand Stores

#### Auth Store
```tsx
import { useAuthStore } from '@/src/stores/auth.store';

// Acceso directo al store
const user = useAuthStore(state => state.user);
const isAuth = useAuthStore(state => state.isAuthenticated);

// Acciones
const { login, logout, updateUser } = useAuthStore();
```

#### User Store
```tsx
import { useUserStore } from '@/src/stores/user.store';

const profile = useUserStore(state => state.profile);
const preferences = useUserStore(state => state.preferences);

const { updateProfile, updatePreferences } = useUserStore();
```

### Almacenamiento Seguro

```tsx
import { setToken, getToken, clearToken } from '@/src/utils/secure-storage';

// Guardar token
await setToken('mi-token-jwt');

// Obtener token
const token = await getToken();

// Limpiar token
await clearToken();

// Guardar datos de usuario
await saveUserData({ id: '1', email: 'user@example.com' });

// Obtener datos
const userData = await getUserData();
```

### Acceso al Usuario y Sesión

```tsx
import { useAuth } from '@/src/hooks/useAuth';

function ProfileScreen() {
  const { user, session, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Text>Nombre: {user?.name}</Text>
      <Text>ID: {session?.user.id}</Text>
    </View>
  );
}
```

### Acceso Directo a Supabase

```tsx
import { supabase } from '@/src/lib/supabase';

// Obtener sesión actual
const { data: { session } } = await supabase.auth.getSession();

// Actualizar perfil de usuario
const { error } = await supabase.auth.updateUser({
  data: { name: 'Nuevo Nombre' }
});

// Verificar email
const { error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email'
});
```

## 🗄️ Base de Datos Supabase

### Crear tabla de perfiles (opcional)

```sql
-- Tabla de perfiles de usuario
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security
alter table profiles enable row level security;

-- Política: Los usuarios solo pueden ver su propio perfil
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Política: Los usuarios pueden actualizar su propio perfil
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Función para crear perfil automáticamente al registrarse
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para crear perfil al registrarse
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 🔑 Estructura de Datos Supabase

### Usuario (Session)
```typescript
{
  user: {
    id: "uuid-here",
    email: "user@example.com",
    user_metadata: {
      name: "Usuario",
      avatar_url: "https://..."
    },
    created_at: "2024-01-01T00:00:00Z"
  },
  access_token: "jwt-token",
  refresh_token: "refresh-token"
}
```

### Errores de Supabase
```typescript
{
  message: "Invalid login credentials",
  status: 400,
  name: "AuthApiError"
}
```

## 📍 Métodos de Supabase Disponibles

```typescript
// Autenticación
supabase.auth.signUp({ email, password, options })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.resetPasswordForEmail(email)
supabase.auth.updateUser({ data })
supabase.auth.getSession()
supabase.auth.onAuthStateChange(callback)

// Base de datos (ejemplo con perfiles)
supabase.from('profiles').select('*')
supabase.from('profiles').insert({ ... })
supabase.from('profiles').update({ ... }).eq('id', userId)
supabase.from('profiles').delete().eq('id', userId)
```

## 🛡️ Seguridad

- **Supabase** maneja automáticamente la seguridad de las sesiones
- Los tokens se almacenan en **Expo Secure Store** (iOS/Android)
- La sesión se renueva automáticamente (autoRefreshToken: true)
- Las sesiones persisten entre reinicios de la app (persistSession: true)
- Row Level Security (RLS) protege los datos en Supabase
- Las contraseñas se validan con Zod antes de enviarlas
- Supabase envía emails de confirmación automáticamente (configurable)

## 🔐 Configuración de Supabase Auth

En tu proyecto de Supabase, ve a **Authentication** > **Settings**:

- **Enable Email Confirmations**: Activar para que los usuarios confirmen su email
- **Enable Email Change Confirmations**: Confirmar cuando cambien el email
- **Secure Password**: Mínimo 6 caracteres por defecto
- **Site URL**: Para redirecciones (ej: `equiapp://`)
- **Redirect URLs**: Agregar URLs permitidas para deep linking

## 🎨 Personalización

### Cambiar colores del tema
Edita los estilos en los componentes o crea un tema global.

### Agregar más validaciones
Edita `src/schemas/auth.schema.ts`:

```typescript
export const customSchema = z.object({
  // tus campos
});
```

### Agregar más endpoints
Crea un nuevo servicio en `src/services/`:

```typescript
// src/services/orders.service.ts
export const orderService = {
  getOrders: async () => { /* ... */ },
  createOrder: async () => { /* ... */ },
};
```

## 📝 Ejemplos de Rutas

### Ruta Pública (Catálogo)
```tsx
// app/(tabs)/products.tsx
// Cualquiera puede ver productos
export default function ProductsScreen() {
  const { data } = useProducts();
  return <ProductList products={data} />;
}
```

### Ruta Protegida (Perfil)
```tsx
// app/(tabs)/profile.tsx
import { ProtectedRoute } from '@/src/components/auth';

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
```

### Ruta Protegida (Compras)
```tsx
// app/checkout.tsx
import { ProtectedRoute } from '@/src/components/auth';

export default function CheckoutScreen() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
```

## 🐛 Debugging

### Ver estado de autenticación
```tsx
const authState = useAuthStore.getState();
console.log('Auth State:', authState);
```

### Ver cache de React Query
```tsx
import { queryClient } from '@/src/config/query-client';

console.log(queryClient.getQueryCache());
```

### Limpiar todo el storage
```tsx
import { secureStore } from '@/src/utils/secure-storage';

await secureStore.clear();
```

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zod Docs](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## ✅ Checklist de Implementación

- [x] Configuración de Supabase con expo-secure-store
- [x] Store de Zustand consolidado con sesión y perfil
- [x] Listener de auth state changes en Zustand
- [x] Validaciones con Zod
- [x] React Query configurado
- [x] Hook useAuth simplificado (solo Zustand)
- [x] Protección de rutas
- [x] Pantallas de autenticación (login, registro, recuperar contraseña)
- [x] Ejemplo de rutas públicas y protegidas
- [x] Ejemplo de servicio con React Query
- [x] ✨ **Sin React Context** - Todo en Zustand para mejor rendimiento

## 🚀 Próximos Pasos

1. **Configurar Supabase**:
   - Crea un proyecto en [Supabase](https://app.supabase.com)
   - Copia las credenciales a tu `.env`
   - Configura las políticas de autenticación

2. **Crear tablas en Supabase** (opcional):
   - Tabla de perfiles
   - Tabla de productos
   - Configurar Row Level Security

3. **Personalizar la app**:
   - Ajusta los estilos según tu diseño
   - Agrega más validaciones según tus necesidades
   - Configura deep linking para reset password

4. **Testing**:
   - Probar registro de usuarios
   - Probar login y logout
   - Verificar que la sesión persista
   - Probar recuperación de contraseña

## 🔄 Migración desde API REST

Si tenías una API REST antes, los cambios principales son:

1. ~~`apiClient.post('/auth/login')`~~ → `supabase.auth.signInWithPassword()`
2. ~~`apiClient.post('/auth/register')`~~ → `supabase.auth.signUp()`
3. ~~`apiClient.post('/auth/logout')`~~ → `supabase.auth.signOut()`
4. ~~`setToken()` y `getToken()`~~ → Manejado automáticamente por Supabase
5. ~~Interceptores de Axios~~ → No necesarios, Supabase maneja los tokens

## 💡 Tips

- **Email Confirmations**: Por defecto, Supabase requiere confirmar email. Puedes desactivarlo en Settings.
- **Desarrollo Local**: Considera usar [Supabase CLI](https://supabase.com/docs/guides/cli) para desarrollo local.
- **Deep Linking**: Configura el deep linking para manejar reset password y confirmación de email.
- **RLS Policies**: Usa Row Level Security para proteger tus datos automáticamente.
- **Realtime**: Supabase incluye subscripciones en tiempo real si las necesitas.
