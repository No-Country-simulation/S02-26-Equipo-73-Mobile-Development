# Sistema de Intercambio de Tokens (Token Exchange)

## Descripción General

Este sistema implementa un flujo de autenticación híbrido donde:
1. Supabase maneja la autenticación inicial (login, registro, confirmación de email)
2. La API de backend valida el token de Supabase y eventualmente generará su propio token JWT
3. Las peticiones a la API usan el token de la API (no el de Supabase)
4. El token de Supabase se mantiene para operaciones específicas de Supabase

## Flujo de Autenticación

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│  User   │         │ Supabase │         │   API   │
└────┬────┘         └────┬─────┘         └────┬────┘
     │                   │                     │
     │  1. Login/SignUp  │                     │
     ├──────────────────>│                     │
     │                   │                     │
     │  2. Token         │                     │
     │<──────────────────┤                     │
     │                   │                     │
     │  3. Exchange Token (Bearer: Supabase)   │
     ├─────────────────────────────────────────>│
     │                   │                     │
     │  4. User Info (+ API Token en futuro)   │
     │<─────────────────────────────────────────┤
     │                   │                     │
     │  5. API Requests (Bearer: API Token)    │
     ├─────────────────────────────────────────>│
     │                   │                     │
```

## Implementación

### 1. Servicio de Autenticación (`src/services/auth.service.ts`)

```typescript
export const exchangeToken = async (supabaseToken: string): Promise<AuthExchangeResponse>
```

- Recibe el token de Supabase
- Llama a `/api/auth/exchange` con el token en el header `Authorization: Bearer {supabaseToken}`
- Guarda el token de la API (cuando el backend lo implemente)
- Retorna información del usuario autenticado

### 2. Store de Autenticación (`src/stores/auth.store.ts`)

El exchange se ejecuta automáticamente en:

- **`login()`**: Después de iniciar sesión exitosamente
- **`register()`**: Después de registrarse (si la sesión se crea inmediatamente)
- **`checkAuth()`**: Al verificar la autenticación al iniciar la app
- **En `callback.tsx`**: Después de confirmar el email

### 3. Callback de Confirmación (`app/auth/callback.tsx`)

Maneja el deep link de confirmación de email:
- Recibe los tokens de Supabase desde la URL
- Establece la sesión en Supabase
- Llama a `exchangeToken()` con el token recibido
- Redirige a la aplicación

### 4. Intercepción de Peticiones (`src/config/api.ts`)

```typescript
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken(); // Token de la API (no de Supabase)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Endpoint de Backend

### POST `/api/auth/exchange`

**Request:**
```http
POST /api/auth/exchange
Authorization: Bearer {supabase_token}
```

**Response Actual:**
```json
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "userId": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "claims": [
      { "type": "sub", "value": "uuid" },
      { "type": "email", "value": "user@example.com" }
    ]
  },
  "message": "Token validated successfully"
}
```

**Response Futura (cuando se implemente el token JWT de la API):**
```json
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "userId": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "token": "api_jwt_token_here",
    "refreshToken": "api_refresh_token_here",
    "claims": [...]
  },
  "message": "Token validated successfully"
}
```

## Gestión de Tokens

### Tokens Almacenados

- **`access_token`**: Token de la API (en secure-storage)
- **`refresh_token`**: Refresh token de la API (en secure-storage)
- **Sesión de Supabase**: Mantenida internamente por Supabase SDK

### Funciones de Almacenamiento

```typescript
// src/utils/secure-storage.ts
setToken(token: string)            // Guardar token de la API
getToken()                         // Obtener token de la API
setRefreshToken(token: string)     // Guardar refresh token
getRefreshToken()                  // Obtener refresh token
clearToken()                       // Limpiar ambos tokens
```

## Manejo de Errores

El exchange de token NO bloquea el flujo de autenticación:

```typescript
try {
  await exchangeToken(supabaseToken);
  console.log('✅ Token intercambiado exitosamente');
} catch (exchangeError) {
  console.warn('⚠️ Error en exchange:', exchangeError.message);
  // El usuario puede continuar usando la app con el token de Supabase
}
```

Esto permite que la app funcione incluso si:
- La API está caída
- Hay problemas de red
- El endpoint de exchange no está disponible

## Logout

Al cerrar sesión se limpian ambos tokens:

```typescript
logout: async () => {
  await supabase.auth.signOut();  // Limpia sesión de Supabase
  await clearToken();              // Limpia tokens de la API
  // ... limpiar estado
}
```

## Consideraciones de Seguridad

1. **Tokens en tránsito**: Siempre enviados por HTTPS
2. **Almacenamiento**: Uso de SecureStore en móvil, AsyncStorage en web
3. **Separación de concerns**: 
   - Supabase maneja autenticación de usuarios
   - API maneja autorización de recursos
4. **No hay duplicación innecesaria**: El token de Supabase no se usa para peticiones a la API

## Próximos Pasos

1. **Backend**: Implementar generación de token JWT propio
2. **Frontend**: El código ya está preparado para recibir y usar el token de la API
3. **Refresh Token**: Implementar lógica de refresh cuando el token expire
4. **Interceptor**: Mejorar el interceptor para renovar tokens automáticamente

## Testing

Para probar el flujo:

1. **Login**: Iniciar sesión con un usuario
   - Verificar logs: `✅ Token intercambiado exitosamente`
   
2. **Registro**: Registrar un nuevo usuario
   - Confirmar email desde el emulador/dispositivo
   - Verificar logs en callback: `→ Intercambiando token con la API...`
   
3. **Peticiones API**: Hacer una petición a la API
   - Verificar que el header `Authorization` tenga el token correcto
   
4. **Logout**: Cerrar sesión
   - Verificar que los tokens se limpien

## Logs de Debug

Buscar en la consola:
- `🔄 Intercambiando token con la API...`
- `✅ Token intercambiado exitosamente`
- `⚠️ Error en exchange de token:`
- `→ Intercambiando token con la API...` (en callback)
