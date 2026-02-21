# 🔐 Supabase Authentication Integration

## 📝 Descripción
Sistema de autenticación integrado con Supabase JWT. Permite validar tokens de Supabase y obtener información del usuario autenticado.

---

## 🎯 Endpoints Disponibles

### **1. POST /api/auth/exchange**
Valida el token de Supabase y retorna información del usuario.

#### **Request:**
```http
POST /api/auth/exchange
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Response (200 OK):**
```json
{
  "success": true,
  "message": "Token validated successfully",
  "data": {
    "isAuthenticated": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "claims": [
      {
        "type": "sub",
        "value": "550e8400-e29b-41d4-a716-446655440000"
      },
      {
        "type": "email",
        "value": "user@example.com"
      },
      {
        "type": "role",
        "value": "authenticated"
      }
    ]
  }
}
```

#### **Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "errorCode": "UNAUTHORIZED"
}
```

---

### **2. GET /api/auth/me**
Obtiene información del usuario autenticado actual.

#### **Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response (200 OK):**
```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "isAuthenticated": true
  }
}
```

---

### **3. GET /api/auth/check**
Health check para verificar si el usuario está autenticado.

#### **Request:**
```http
GET /api/auth/check
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication verified",
  "data": {
    "isAuthenticated": true,
    "message": "User is authenticated"
  }
}
```

---

## 🔧 Configuración

### **appsettings.json**
```json
{
  "Supabase": {
    "projectId": "tu-project-id",
    "secret": "tu-jwt-secret"
  }
}
```

### **appsettings.Development.json**
```json
{
  "Supabase": {
    "projectId": "your-project-id",
    "secret": "your-jwt-secret-from-supabase-settings"
  }
}
```

**¿Dónde obtener el JWT secret?**
1. Ve a tu proyecto de Supabase
2. Settings → API
3. Copia el valor de **JWT Secret**

---

## 📋 Cómo Usar

### **Paso 1: Login en Supabase (Frontend)**

```javascript
// React/React Native con @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_ANON_KEY')

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

if (data) {
  const accessToken = data.session.access_token
  console.log('Token:', accessToken)
}
```

### **Paso 2: Exchange Token en tu API**

```javascript
// Validar el token en tu backend
const response = await fetch('https://your-api.com/api/auth/exchange', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})

const result = await response.json()

if (result.success) {
  console.log('Usuario autenticado:', result.data)
  // Guardar información del usuario
  localStorage.setItem('userId', result.data.userId)
  localStorage.setItem('email', result.data.email)
}
```

### **Paso 3: Usar el Token en Requests Posteriores**

```javascript
// Cualquier request que requiera autenticación
const response = await fetch('https://your-api.com/api/products', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

---

## 🛠️ Ejemplos con diferentes clientes

### **cURL**
```bash
# Exchange token
curl -X POST https://your-api.com/api/auth/exchange \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"

# Get user info
curl -X GET https://your-api.com/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Postman**
1. **Headers:**
   - Key: `Authorization`
   - Value: `Bearer {tu_token}`

2. **Request:**
   - Method: `POST`
   - URL: `{{baseUrl}}/api/auth/exchange`

### **JavaScript Fetch**
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

fetch('https://your-api.com/api/auth/exchange', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

### **Axios**
```javascript
import axios from 'axios'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const response = await axios.post(
  'https://your-api.com/api/auth/exchange',
  {},
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

console.log(response.data)
```

---

## 🔐 Proteger Endpoints

Para proteger cualquier endpoint con autenticación, simplemente agrega el atributo `[Authorize]`:

```csharp
[HttpGet("protected-endpoint")]
[Authorize]
public IActionResult ProtectedEndpoint()
{
    var userId = User.FindFirst("sub")?.Value;
    return Ok($"Hello user {userId}");
}
```

---

## 📊 Claims Disponibles en el Token

El JWT de Supabase incluye los siguientes claims (pueden variar según tu configuración):

| Claim | Descripción | Ejemplo |
|-------|-------------|---------|
| `sub` | User ID | `550e8400-e29b-41d4-a716-446655440000` |
| `email` | Email del usuario | `user@example.com` |
| `role` | Rol del usuario | `authenticated` |
| `aud` | Audience | `authenticated` |
| `iss` | Issuer | `https://your-project.supabase.co/auth/v1` |
| `exp` | Expiration time | `1735689600` |
| `iat` | Issued at | `1735686000` |

### **Cómo Acceder a los Claims en C#:**

```csharp
[HttpGet("user-info")]
[Authorize]
public IActionResult GetUserInfo()
{
    var userId = User.FindFirst("sub")?.Value;
    var email = User.FindFirst("email")?.Value;
    var role = User.FindFirst("role")?.Value;
    
    return Ok(new 
    {
        userId,
        email,
        role
    });
}
```

---

## 🧪 Testing

### **Test con Token Válido:**
```bash
# 1. Login en Supabase y obtén el token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Exchange token
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer $TOKEN"

# Respuesta esperada: 200 OK con información del usuario
```

### **Test con Token Inválido:**
```bash
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer invalid-token"

# Respuesta esperada: 401 Unauthorized
```

### **Test sin Token:**
```bash
curl -X POST http://localhost:5000/api/auth/exchange

# Respuesta esperada: 401 Unauthorized
```

---

## 🔍 Troubleshooting

### **Error: 401 Unauthorized con token válido**

**Causa:** JWT Secret incorrecto en appsettings.json

**Solución:**
1. Verifica que el `secret` en `appsettings.json` coincida con el JWT Secret de Supabase
2. Ve a Supabase → Settings → API → JWT Secret
3. Copia y pega el valor exacto

```json
{
  "Supabase": {
    "secret": "COPIA_AQUI_EL_JWT_SECRET_DE_SUPABASE"
  }
}
```

### **Error: Issuer validation failed**

**Causa:** `projectId` incorrecto en appsettings.json

**Solución:**
1. Verifica tu Project ID en Supabase
2. URL de tu proyecto: `https://{project-id}.supabase.co`
3. Actualiza el `projectId` en appsettings.json

```json
{
  "Supabase": {
    "projectId": "tu-project-id"
  }
}
```

### **Error: Token expired**

**Causa:** El access_token de Supabase expiró (duración por defecto: 1 hora)

**Solución:**
```javascript
// Refrescar el token
const { data, error } = await supabase.auth.refreshSession()
if (data) {
  const newAccessToken = data.session.access_token
  // Usar el nuevo token
}
```

---

## 📚 Flujo Completo de Autenticación

```
┌─────────┐          ┌──────────┐          ┌────────────┐
│ Cliente │          │ Supabase │          │  Tu API    │
└────┬────┘          └────┬─────┘          └─────┬──────┘
     │                    │                       │
     │  1. Login          │                       │
     ├───────────────────>│                       │
     │                    │                       │
     │  2. Access Token   │                       │
     │<───────────────────┤                       │
     │                    │                       │
     │  3. POST /api/auth/exchange               │
     │  Authorization: Bearer {token}            │
     ├───────────────────────────────────────────>│
     │                    │                       │
     │                    │  4. Valida JWT        │
     │                    │      (secret + issuer)│
     │                    │                       │
     │  5. User Info (200 OK)                    │
     │<───────────────────────────────────────────┤
     │                    │                       │
     │  6. Requests autenticados                 │
     │  Authorization: Bearer {token}            │
     ├───────────────────────────────────────────>│
     │                    │                       │
```

---

## ✅ Checklist de Implementación

- ✅ **AuthController** creado con 3 endpoints
- ✅ **JWT Validation** configurada en `ServiceCollectionExtensions`
- ✅ **Supabase Settings** configurados
- ✅ **Response Models** documentados
- ✅ **[Authorize]** attribute en endpoints protegidos
- ✅ **Claims extraction** implementado
- ⏳ **Testing** (manual con Postman/cURL)

---

## 🎯 Siguientes Pasos

1. **Compilar y ejecutar:**
   ```bash
   dotnet run --project FacadeApi
   ```

2. **Probar con Postman:**
   - Obtén un token de Supabase
   - Llama a `/api/auth/exchange` con el token
   - Verifica que retorna `isAuthenticated: true`

3. **Proteger endpoints existentes:**
   ```csharp
   [HttpPost]
   [Authorize]  // ← Agregar esto
   public async Task<IActionResult> CreateProduct(CreateProductDto dto)
   {
       // Solo usuarios autenticados pueden crear productos
   }
   ```

4. **Integrar en frontend:**
   - Usar el token en todos los requests
   - Guardar información del usuario
   - Refrescar token cuando expire

---

**¡Sistema de autenticación con Supabase completamente integrado! 🎉**
