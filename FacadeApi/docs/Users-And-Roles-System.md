# 🔐 Sistema de Usuarios y Roles - Clean Architecture

## ✅ Resumen de Implementación

Sistema completo de **Usuarios, Roles y Autorización** integrado con Supabase.

---

## 📂 Archivos Creados (16)

### **Domain Layer**
1. ✅ `Domain\Entities\Identity\ApplicationUser.cs`
2. ✅ `Domain\Entities\Identity\Role.cs`
3. ✅ `Domain\Entities\Identity\ApplicationUserRole.cs`

### **Application Layer**
4. ✅ `Application\DTOs\Identity\UserDto.cs`
5. ✅ `Application\DTOs\Identity\CreateUserDto.cs`
6. ✅ `Application\DTOs\Identity\UpdateUserDto.cs`
7. ✅ `Application\DTOs\Identity\RoleDto.cs`
8. ✅ `Application\Interfaces\IUserService.cs`
9. ✅ `Application\Interfaces\Repositories\IUserRepository.cs`
10. ✅ `Application\Services\Identity\UserService.cs`

### **Infrastructure Layer**
11. ✅ `Infrastructure\Repositories\UserRepository.cs`
12. ✅ `Infrastructure\JWT\JwtSettings.cs`
13. ✅ `Infrastructure\Services\JwtTokenService.cs`
14. ✅ `Infrastructure\Persistence\Seed\RoleSeeder.cs`

### **Presentation Layer**
15. ✅ `FacadeApi\Controllers\AuthController.cs` (actualizado)

### **Configuración**
16. ✅ `AppDbContext.cs` (actualizado con nuevas entidades)
17. ✅ `ServiceCollectionExtensions.cs` (actualizado con servicios)
18. ✅ `AutoMap.cs` (actualizado con mappings)
19. ✅ `ErrorCodes.cs` (actualizado con códigos de error)

---

## 🗄️ Esquema de Base de Datos

### **ApplicationUsers**
```sql
CREATE TABLE ApplicationUsers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SupabaseId NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Phone NVARCHAR(20),
    ProfileImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    IsDeleted BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Índices
CREATE UNIQUE INDEX IX_ApplicationUsers_SupabaseId ON ApplicationUsers(SupabaseId);
CREATE UNIQUE INDEX IX_ApplicationUsers_Email ON ApplicationUsers(Email);
CREATE INDEX IX_ApplicationUsers_IsActive ON ApplicationUsers(IsActive);
CREATE INDEX IX_ApplicationUsers_IsDeleted ON ApplicationUsers(IsDeleted);
```

### **Roles**
```sql
CREATE TABLE Roles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    NormalizedName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Datos iniciales
INSERT INTO Roles (Id, Name, NormalizedName, Description) VALUES
(1, 'Admin', 'ADMIN', 'Administrator with full access'),
(2, 'User', 'USER', 'Standard user with basic access'),
(3, 'Manager', 'MANAGER', 'Manager with product management access');
```

### **ApplicationUserRoles (Many-to-Many)**
```sql
CREATE TABLE ApplicationUserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    AssignedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES ApplicationUsers(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

CREATE INDEX IX_ApplicationUserRoles_UserId ON ApplicationUserRoles(UserId);
CREATE INDEX IX_ApplicationUserRoles_RoleId ON ApplicationUserRoles(RoleId);
```

---

## 🎯 Flujo de Autenticación y Autorización

### **1. Login en Supabase (Frontend)**
```javascript
const { data } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const supabaseToken = data.session.access_token
```

### **2. Exchange Token (POST /api/auth/exchange)**
```javascript
const response = await fetch('https://your-api.com/api/auth/exchange', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseToken}`, // Token de Supabase
    'Content-Type': 'application/json'
  }
})

const result = await response.json()

// Guardar JWT de la API
const apiToken = result.data.accessToken
localStorage.setItem('apiToken', apiToken)
localStorage.setItem('userId', result.data.internalUserId)
localStorage.setItem('roles', JSON.stringify(result.data.roles))
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "userId": "550e8400-...",          // Supabase UUID
    "internalUserId": 1,                // ID interno
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profileImageUrl": "https://cdn.../profile.jpg",
    "role": "User",
    "roles": ["User"],
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "base64_random...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

### **3. Usar JWT de la API**
```javascript
const apiToken = localStorage.getItem('apiToken')

const response = await fetch('https://your-api.com/api/products', {
  headers: {
    'Authorization': `Bearer ${apiToken}` // JWT de la API
  }
})
```

---

## 📊 Claims en el JWT de la API

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // Supabase UUID
  "email": "user@example.com",
  "userId": "1",                                    // ID interno
  "role": "User",                                   // Rol principal
  "roles": "User,Manager",                          // Todos los roles
  "name": "John Doe",
  "provider": "supabase",
  "isActive": "True",
  "jti": "guid-...",
  "iss": "https://tu-api.com",
  "aud": "tu-api-client",
  "exp": 1735689600,
  "iat": 1735686000
}
```

---

## 🔧 Configuración

### **appsettings.json**
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=facadeapi;Username=postgres;Password=password"
  },
  "Jwt": {
    "Secret": "tu-super-secret-key-minimo-32-caracteres-aqui-para-firmar-jwt-de-la-api",
    "Issuer": "https://tu-api.com",
    "Audience": "tu-api-client",
    "ExpirationInMinutes": 1440,
    "RefreshTokenExpirationInDays": 7
  },
  "Supabase": {
    "ProjectId": "tu-project-id"
  }
}
```

---

## 🚀 Migración y Seeding

### **1. Crear migración:**
```bash
dotnet ef migrations add AddApplicationUserAndRoles -p Infrastructure -s FacadeApi
```

### **2. Aplicar migración:**
```bash
dotnet ef database update -p Infrastructure -s FacadeApi
```

### **3. Verificar roles seeded:**
```sql
SELECT * FROM Roles;
-- Debería mostrar: Admin, User, Manager
```

---

## 🛡️ Autorización por Roles

### **Verificar rol en Controller:**
```csharp
[HttpPost]
[Authorize(AuthenticationSchemes = "ApiJwt", Roles = "Admin")]
public IActionResult AdminOnly()
{
    return Ok("Solo admins pueden ver esto");
}
```

### **Múltiples roles:**
```csharp
[HttpGet]
[Authorize(AuthenticationSchemes = "ApiJwt", Roles = "Admin,Manager")]
public IActionResult AdminOrManager()
{
    return Ok("Admins o Managers pueden ver esto");
}
```

### **Obtener roles en el código:**
```csharp
[HttpGet]
[Authorize(AuthenticationSchemes = "ApiJwt")]
public IActionResult GetUserRoles()
{
    var roles = User.FindFirst("roles")?.Value?.Split(',').ToList() ?? new List<string>();
    var primaryRole = User.FindFirst("role")?.Value;
    
    return Ok(new { primaryRole, roles });
}
```

---

## 📝 Ejemplos de Uso

### **1. Crear usuario manualmente**
```csharp
POST /api/users
{
  "supabaseId": "550e8400-...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "profileImage": "data:image/jpeg;base64,/9j/4AAQ...",
  "roleIds": [2] // Rol "User"
}
```

### **2. Actualizar usuario**
```csharp
PUT /api/users/1
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321",
  "roleIds": [2, 3] // User + Manager
}
```

### **3. Obtener usuario actual**
```csharp
GET /api/auth/me
Authorization: Bearer {api_jwt_token}

Response:
{
  "userId": "550e8400-...",
  "internalUserId": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["User", "Manager"]
}
```

---

## 🎯 Features Implementadas

### ✅ **Gestión de Usuarios**
- Crear usuario (manual o automático en exchange)
- Obtener usuario por ID / Supabase ID / Email
- Actualizar usuario
- Eliminar usuario (soft delete)
- Upload de imagen de perfil

### ✅ **Gestión de Roles**
- Roles predefinidos: Admin, User, Manager
- Asignación de múltiples roles por usuario
- Verificación de roles en JWT

### ✅ **Integración con Supabase**
- Exchange de token automático
- Creación automática de usuario en primer login
- Sincronización de datos (email, nombre)

### ✅ **JWT Personalizado**
- Claims personalizados (userId, roles, name, etc.)
- Expiración configurable
- Refresh token generado

---

## 🧪 Testing del Flujo Completo

### **Test 1: Primer Login (Usuario Nuevo)**
```bash
# 1. Login en Supabase (obtener token)
SUPABASE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Exchange (crea usuario automáticamente)
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer $SUPABASE_TOKEN"

# 3. Verificar que el usuario se creó
SELECT * FROM ApplicationUsers WHERE Email = 'user@example.com';
```

### **Test 2: Login Subsecuente (Usuario Existente)**
```bash
# 1. Login en Supabase
# 2. Exchange (retorna usuario existente)
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer $SUPABASE_TOKEN"

# 3. Usar API JWT
API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $API_TOKEN"
```

### **Test 3: Verificar Roles**
```bash
# El JWT incluye los roles
# Decodificar en jwt.io para ver:
{
  "role": "User",
  "roles": "User",
  "userId": "1"
}
```

---

## 📊 Estructura de Datos

### **Roles Iniciales**
| Id | Name | NormalizedName | Description |
|----|------|----------------|-------------|
| 1 | Admin | ADMIN | Full access |
| 2 | User | USER | Basic access |
| 3 | Manager | MANAGER | Product management |

### **Usuario Ejemplo**
```json
{
  "id": 1,
  "supabaseId": "550e8400-...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "profileImageUrl": "https://cdn.../profile.jpg",
  "isActive": true,
  "roles": [
    {
      "id": 2,
      "name": "User",
      "normalizedName": "USER"
    }
  ]
}
```

---

## 🔒 Seguridad

### **Password Hashing**
- ✅ Contraseñas manejadas por Supabase (no almacenadas localmente)

### **JWT Secret**
- ✅ Mínimo 32 caracteres
- ✅ Aleatorio y secreto
- ✅ Diferente para cada ambiente

### **Soft Delete**
- ✅ `IsDeleted = true` en lugar de eliminar físicamente
- ✅ Usuarios eliminados no pueden autenticarse

### **Token Expiration**
- ✅ Access Token: 24 horas (configurable)
- ✅ Refresh Token: 7 días (configurable)

---

## 🎯 Próximos Pasos

### **Implementación Completa:**
1. ✅ Entidades creadas
2. ✅ DTOs creados
3. ✅ Repositories implementados
4. ✅ Services implementados
5. ✅ JWT Service implementado
6. ✅ AutoMapper configurado
7. ✅ Seeders creados
8. ✅ AuthController actualizado
9. ⏳ Migración (ejecutar manualmente)
10. ⏳ Testing

### **Comandos para Ejecutar:**

```bash
# 1. Crear migración
dotnet ef migrations add AddApplicationUserAndRoles -p Infrastructure -s FacadeApi

# 2. Aplicar migración
dotnet ef database update -p Infrastructure -s FacadeApi

# 3. Ejecutar aplicación
dotnet run --project FacadeApi

# 4. Probar endpoint
curl -X POST http://localhost:5000/api/auth/exchange \
  -H "Authorization: Bearer {supabase_token}"
```

---

## 📚 Endpoints Disponibles

### **Auth Endpoints**
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/exchange` | SupabaseJwt | Intercambiar token, crear/obtener usuario |
| GET | `/api/auth/me` | ApiJwt | Información del usuario actual |
| GET | `/api/auth/check` | ApiJwt | Health check de autenticación |

### **User Endpoints (TODO - próximo paso)**
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/users/{id}` | ApiJwt | Obtener usuario por ID |
| PUT | `/api/users/{id}` | ApiJwt | Actualizar usuario |
| DELETE | `/api/users/{id}` | ApiJwt (Admin) | Eliminar usuario |
| POST | `/api/users/{id}/roles` | ApiJwt (Admin) | Asignar roles |

---

## ✅ Checklist Completo

### **Domain**
- ✅ ApplicationUser entity
- ✅ Role entity
- ✅ ApplicationUserRole entity (many-to-many)

### **Application**
- ✅ UserDto, CreateUserDto, UpdateUserDto, RoleDto
- ✅ IUserService interface
- ✅ IUserRepository interface
- ✅ UserService implementation
- ✅ Error codes (USER_NOT_FOUND, etc.)

### **Infrastructure**
- ✅ UserRepository implementation
- ✅ JwtSettings configuration
- ✅ JwtTokenService implementation
- ✅ AppDbContext configuration
- ✅ AutoMapper profiles
- ✅ RoleSeeder
- ✅ ServiceCollection registration

### **Presentation**
- ✅ AuthController integration
- ✅ Exchange endpoint con usuario
- ✅ JWT generation con roles

---

## 🎉 Resultado Final

### **Flujo Completo:**
```
1. Usuario hace login en Supabase
   ↓
2. Frontend envía token de Supabase a /api/auth/exchange
   ↓
3. Backend valida token con esquema SupabaseJwt
   ↓
4. Backend busca usuario en BD por SupabaseId
   ├─ Si existe: retorna usuario
   └─ Si NO existe: crea usuario con rol "User"
   ↓
5. Backend genera JWT propio con claims:
   - userId (interno)
   - roles
   - email
   - name
   - etc.
   ↓
6. Frontend recibe API JWT + info del usuario
   ↓
7. Frontend usa API JWT para requests futuros
   ↓
8. Backend valida con esquema ApiJwt
```

---

## 💡 Ventajas del Sistema

1. ✅ **Clean Architecture**: Separación clara de capas
2. ✅ **Autorización Flexible**: Múltiples roles por usuario
3. ✅ **Sincronización Automática**: Usuario se crea en primer login
4. ✅ **JWT Personalizado**: Claims adicionales para lógica de negocio
5. ✅ **Soft Delete**: No se pierde información
6. ✅ **Testeable**: Cada capa se puede testear independientemente
7. ✅ **Escalable**: Fácil agregar más roles y permisos

---

**¡Sistema completo de Usuarios y Roles implementado según Clean Architecture! 🎉**
