# EquiApp - Configuración de Autenticación

Sistema completo de autenticación y manejo de estado para React Native con Expo.

## 📦 Librerías Instaladas

- **axios** - Cliente HTTP
- **@tanstack/react-query** - Gestión de estado del servidor
- **zod** - Validación de schemas
- **react-hook-form** - Manejo de formularios
- **zustand** - Gestión de estado global
- **@react-native-async-storage/async-storage** - Almacenamiento persistente
- **expo-secure-store** - Almacenamiento seguro de tokens

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   ├── env.ts              # Variables de entorno
│   ├── api.ts              # Cliente Axios configurado
│   └── query-client.ts     # Configuración de React Query
├── stores/
│   ├── auth.store.ts       # Store de autenticación (Zustand)
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
├── utils/
│   └── secure-storage.ts   # Utilidades de almacenamiento
├── services/
│   └── products.service.ts # Ejemplo de servicio con React Query
└── index.ts                # Exportaciones centrales
```

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Actualiza tu archivo `.env`:

```env
EXPO_PUBLIC_API_URL=https://tu-api.com/api
```

### 2. Configuración de TypeScript

El alias `@/*` ya está configurado en `tsconfig.json` para apuntar a la raíz del proyecto.

### 3. App.json (si usas expo-constants)

Agrega en `app.json`:

```json
{
  "expo": {
    "extra": {
      "API_URL": process.env.EXPO_PUBLIC_API_URL
    }
  }
}
```

## 📱 Uso

### Autenticación

#### Login
```tsx
import { useAuth } from '@/src/hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: '123456' });
  };
}
```

#### Registro
```tsx
const { register } = useAuth();

await register({
  email: 'user@example.com',
  password: '123456',
  confirmPassword: '123456',
  name: 'Usuario'
});
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

## 🔑 Estructura de Respuestas API

Tu API debe seguir este formato:

```typescript
// Éxito
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "Usuario"
    },
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here" // opcional
  },
  "message": "Login exitoso"
}

// Error
{
  "success": false,
  "message": "Credenciales inválidas",
  "errors": {
    "email": ["Email inválido"]
  }
}
```

## 📍 Endpoints Esperados

```
POST   /auth/login         - Iniciar sesión
POST   /auth/register      - Registrar usuario
POST   /auth/logout        - Cerrar sesión
GET    /auth/me            - Obtener usuario actual
POST   /auth/forgot-password - Recuperar contraseña
PUT    /user/profile       - Actualizar perfil
GET    /products           - Listar productos (público)
GET    /products/:id       - Ver producto (público)
```

## 🛡️ Seguridad

- Los tokens se almacenan en **Expo Secure Store** (iOS/Android) o **AsyncStorage** (web)
- El interceptor de Axios agrega automáticamente el token a todas las peticiones
- Si el token expira (401), se limpia automáticamente
- Las contraseñas se validan con Zod antes de enviarlas

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

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zod Docs](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## ✅ Checklist de Implementación

- [x] Configuración de Axios con interceptores
- [x] Stores de Zustand para auth y usuario
- [x] Almacenamiento seguro de tokens
- [x] Validaciones con Zod
- [x] React Query configurado
- [x] Hooks personalizados (useAuth, useUser)
- [x] Protección de rutas
- [x] Pantallas de autenticación (login, registro)
- [x] Ejemplo de rutas públicas y protegidas
- [x] Ejemplo de servicio con React Query

## 🚀 Próximos Pasos

1. Actualiza la `API_URL` en tu `.env`
2. Ajusta los tipos según las respuestas de tu API
3. Personaliza los estilos según tu diseño
4. Agrega más validaciones según tus necesidades
5. Implementa refresh token si tu API lo soporta
