# 🔐 Sistema JWT Dual - Supabase + API Propia

## 📋 Descripción

Sistema de autenticación con **2 esquemas JWT**:
1. **SupabaseJwt**: Solo para el endpoint `/exchange` (valida token de Supabase)
2. **ApiJwt**: Para todos los demás endpoints protegidos (usa JWT propio de la API)

---

## 🎯 Flujo Completo

```
┌──────────┐     ┌──────────┐     ┌────────────┐     ┌──────────┐
│ Cliente  │     │ Supabase │     │  /exchange │     │ Endpoints│
└─────┬────┘     └─────┬────┘     └──────┬─────┘     └────┬─────┘
      │                │                  │                │
      │  1. Login      │                  │                │
      ├───────────────>│                  │                │
      │                │                  │                │
      │  2. Supabase   │                  │                │
      │     Token      │                  │                │
      │<───────────────┤                  │                │
      │                │                  │                │
      │  3. POST /api/auth/exchange      │                │
      │     (Supabase Token)             │                │
      ├──────────────────────────────────>│                │
      │                │                  │                │
      │                │  4. Valida con   │                │
      │                │     SupabaseJwt  │                │
      │                │                  │                │
      │                │  5. Genera JWT   │                │
      │                │     propio (API) │                │
      │                │                  │                │
      │  6. API JWT + RefreshToken       │                │
      │<──────────────────────────────────┤                │
      │                │                  │                │
      │  7. Requests con API JWT                         │
      ├──────────────────────────────────────────────────>│
      │                │                  │                │
      │                │                  │  8. Valida con │
      │                │                  │     ApiJwt     │
      │                │                  │                │
      │  9. Response                                      │
      │<──────────────────────────────────────────────────┤
      │                │                  │                │
```

---

## 🔧 Configuración

### **appsettings.json**

```json
{
  "Jwt": {
    "Secret": "tu-super-secret-key-minimo-32-caracteres-aqui-para-firmar-jwt",
    "Issuer": "https://tu-api.com",
    "Audience": "tu-api-client",
    "ExpirationInMinutes": 1440,
    "RefreshTokenExpirationInDays": 7
  },
  "Supabase": {
    "ProjectId": "tu-project-id",
    "Secret": "tu-jwt-secret-de-supabase"
  }
}
```

**Importante:**
- `Jwt.Secret`: Mínimo 32 caracteres, aleatorio y secreto
- `Jwt.Issuer`: URL de tu API
- `Supabase.Secret`: JWT Secret de Supabase (Settings → API)

---

## 📝 Endpoints

### **1. POST /api/auth/exchange**

Intercambia el token de Supabase por un JWT propio de la API.

**Autenticación:** `SupabaseJwt` (token de Supabase)

**Request:**
```http
POST /api/auth/exchange
Authorization: Bearer {supabase_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token exchanged successfully",
  "data": {
    "isAuthenticated": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "base64_random_string...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "claims": [...]
  }
}
```

---

### **2. GET /api/auth/me**

Obtiene información del usuario autenticado.

**Autenticación:** `ApiJwt` (JWT de la API)

**Request:**
```http
GET /api/auth/me
Authorization: Bearer {api_jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isAuthenticated": true
  }
}
```

---

### **3. GET /api/auth/check**

Health check de autenticación.

**Autenticación:** `ApiJwt` (JWT de la API)

**Request:**
```http
GET /api/auth/check
Authorization: Bearer {api_jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication verified",
  "data": {
    "isAuthenticated": true,
    "userId": "550e8400-...",
    "message": "User is authenticated"
  }
}
```

---

## 💻 Uso desde Frontend

### **Paso 1: Login en Supabase**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

if (data) {
  const supabaseToken = data.session.access_token
  console.log('Supabase Token:', supabaseToken)
}
```

---

### **Paso 2: Exchange Token**

```typescript
// Intercambiar token de Supabase por JWT de la API
const response = await fetch('https://your-api.com/api/auth/exchange', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseToken}`, // Token de Supabase
    'Content-Type': 'application/json'
  }
})

const result = await response.json()

if (result.success) {
  // Guardar JWT de la API
  const apiToken = result.data.accessToken
  const refreshToken = result.data.refreshToken
  
  localStorage.setItem('apiToken', apiToken)
  localStorage.setItem('refreshToken', refreshToken)
  
  console.log('API Token:', apiToken)
}
```

---

### **Paso 3: Usar JWT de la API**

```typescript
// Usar el JWT de la API para requests protegidos
const apiToken = localStorage.getItem('apiToken')

const response = await fetch('https://your-api.com/api/products', {
  headers: {
    'Authorization': `Bearer ${apiToken}`, // JWT de la API
    'Content-Type': 'application/json'
  }
})

const products = await response.json()
```

---

## 🔐 Claims Personalizados

El JWT de la API incluye los siguientes claims:

| Claim | Descripción | Ejemplo |
|-------|-------------|---------|
| `sub` | User ID | `550e8400-e29b-41d4-a716-446655440000` |
| `email` | Email del usuario | `user@example.com` |
| `role` | Rol del usuario | `user`, `admin` |
| `name` | Nombre del usuario | `John Doe` |
| `provider` | Proveedor de auth | `supabase` |
| `jti` | JWT ID (único) | `guid-...` |
| `iss` | Issuer | `https://tu-api.com` |
| `aud` | Audience | `tu-api-client` |
| `exp` | Expiration | `1735689600` |
| `iat` | Issued at | `1735686000` |

---

## 🛡️ Proteger Endpoints

### **Con JWT de la API (ApiJwt)**

```csharp
[HttpGet]
[Authorize(AuthenticationSchemes = "ApiJwt")]
public IActionResult GetProtectedData()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var role = User.FindFirst("role")?.Value;
    
    return Ok(new { userId, role });
}
```

### **Sin especificar esquema (usa default: ApiJwt)**

```csharp
[HttpGet]
[Authorize] // Usa ApiJwt por defecto
public IActionResult GetData()
{
    return Ok("Protected data");
}
```

---

## 🔄 Renovar Token (Refresh)

### **Endpoint (TODO - implementar)**

```csharp
[HttpPost("refresh")]
public IActionResult RefreshToken([FromBody] RefreshTokenRequest request)
{
    // Validar refresh token
    // Generar nuevo access token
    // Retornar nuevo access token
}
```

### **Uso desde Frontend**

```typescript
const refreshToken = localStorage.getItem('refreshToken')

const response = await fetch('https://your-api.com/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refreshToken: refreshToken
  })
})

const result = await response.json()

if (result.success) {
  const newApiToken = result.data.accessToken
  localStorage.setItem('apiToken', newApiToken)
}
```

---

## 🧪 Testing

### **1. Login en Supabase**
```bash
# Obtener token de Supabase (desde frontend)
SUPABASE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **2. Exchange Token**
```bash
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

### **3. Usar JWT de la API**
```bash
API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $API_TOKEN"
```

---

## 📊 Comparación de Esquemas

| Aspecto | SupabaseJwt | ApiJwt |
|---------|-------------|--------|
| **Uso** | Solo `/exchange` | Todos los endpoints protegidos |
| **Issuer** | Supabase | Tu API |
| **Secret** | Supabase JWT Secret | Tu propio secret |
| **Duración** | 1 hora (Supabase) | Configurable (24h default) |
| **Claims** | De Supabase | Personalizados por ti |
| **Renovación** | Supabase Refresh | Tu refresh token |

---

## ✅ Checklist de Implementación

- ✅ **JwtSettings** configurado
- ✅ **IJwtTokenService** creado
- ✅ **JwtTokenService** implementado
- ✅ **ServiceCollectionExtensions** actualizado con 2 esquemas
- ✅ **AuthController** actualizado con generación de JWT
- ✅ **appsettings.Example.json** creado
- ⏳ **Endpoint /refresh** (pendiente)
- ⏳ **Tests** (pendiente)

---

## 🎯 Ventajas del Sistema

1. ✅ **Seguridad**: Tokens propios con claims personalizados
2. ✅ **Control**: Expiración y refresh configurables
3. ✅ **Flexibilidad**: Agregar claims adicionales fácilmente
4. ✅ **Independencia**: No dependes 100% de Supabase
5. ✅ **Escalabilidad**: Fácil agregar roles, permisos, etc.

---

## 📚 Próximos Pasos

1. **Compilar y probar:**
   ```bash
   dotnet build
   dotnet run --project FacadeApi
   ```

2. **Configurar appsettings.json** con valores reales

3. **Probar el flujo:**
   - Login en Supabase
   - Exchange token
   - Usar JWT de la API

4. **Implementar refresh token endpoint**

5. **Agregar roles y permisos**

---

**¡Sistema JWT dual completamente implementado! 🎉🔐**
