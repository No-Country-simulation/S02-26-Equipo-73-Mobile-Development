# 🐴 EquiApp - Plataforma Ecuestre

**Versión**: 1.1.0  
**Proyecto**: No Country S02-26  
**Fecha**: Febrero 2026

Plataforma completa para el mercado ecuestre que conecta compradores y vendedores de productos equinos, con sistema de autenticación avanzado, gestión de productos y catálogo interactivo.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Documentación](#-documentación)
- [Estado del Proyecto](#-estado-del-proyecto)

---

## 🎯 Descripción

**EquiApp (RiderFit)** es una plataforma integral para el mercado ecuestre que incluye:

- 📱 **Aplicación móvil** React Native multiplataforma (iOS/Android)
- 🚀 **API REST** robusta con .NET 8 y Clean Architecture
- 🔐 **Autenticación segura** con Supabase
- 📦 **Catálogo de productos** con filtros avanzados y paginación
- 🏪 **Sistema de marcas** y marcas ecuestres reconocidas
- 🎨 **Sistema de temas** personalizable
- 🐳 **Infraestructura Dockerizada** lista para producción

---

## 🏗️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (equiApp)                   │
│  React Native + Expo + TypeScript + Supabase Auth       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FacadeApi)                     │
│          .NET 8 + Clean Architecture + JWT              │
│  ┌──────────────┬───────────────┬────────────────────┐ │
│  │  Controllers │  Application  │  Infrastructure    │ │
│  │              │  (Services)   │  (Repositories)    │ │
│  └──────────────┴───────────────┴────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
┌──────────┐  ┌────────────┐  ┌─────────┐
│PostgreSQL│  │   MinIO    │  │Supabase │
│+ pgvector│  │    S3      │  │  Auth   │
└──────────┘  └────────────┘  └─────────┘
```

### Backend - Clean Architecture

```
Domain          → Entidades y lógica de negocio
Application     → DTOs, Servicios, Interfaces
Infrastructure  → Repositorios, EF Core, JWT
FacadeApi       → Controllers, Middleware
```

---

## 🛠️ Tecnologías

### Frontend (equiApp)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Native | 0.81.5 | Framework móvil |
| Expo | ~54.0 | Toolchain y build |
| TypeScript | 5.9 | Tipado estático |
| Expo Router | 6.0 | Navegación |
| Supabase JS | 2.95 | Autenticación |
| React Query | 5.90 | Estado del servidor |
| Zustand | 5.0 | Estado global |
| React Hook Form | 7.71 | Formularios |
| Zod | 4.3 | Validación |
| Axios | 1.13 | Cliente HTTP |

### Backend (FacadeApi)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| .NET | 8.0 | Framework |
| Entity Framework Core | 8.0 | ORM |
| PostgreSQL | 18 | Base de datos |
| pgvector | 0.8.1 | Vectores embeddings |
| AutoMapper | - | Mapeo DTO-Entity |
| JWT Bearer | - | Autenticación |
| Supabase JWT | - | Integración auth |
| MinIO | Latest | Almacenamiento S3 |

### Infraestructura

- **Docker Compose** - Orquestación de servicios
- **PostgreSQL 18** con pgvector
- **MinIO** - Almacenamiento de archivos
- **OpenAPI/Scalar** - Documentación API

---

## 📁 Estructura del Proyecto

```
S02-26/
├── README.md                    # Este archivo
├── docker-compose.yml           # Orquestación de servicios
├── .env                         # Variables de entorno
│
├── equiApp/                     # 📱 FRONTEND - App Móvil
│   ├── app/                     # Expo Router (rutas)
│   │   ├── (tabs)/             # Navegación con tabs
│   │   ├── auth/               # Pantallas de autenticación
│   │   ├── product/            # Pantallas de productos
│   │   ├── settings/           # Configuración
│   │   └── index.tsx           # Pantalla principal
│   ├── src/                    # Código fuente
│   │   ├── components/         # Componentes reutilizables
│   │   ├── config/             # Configuración (API, env)
│   │   ├── constants/          # Constantes y temas
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Librerías (Supabase)
│   │   ├── providers/          # Context providers
│   │   ├── schemas/            # Validaciones Zod
│   │   ├── services/           # Servicios API
│   │   ├── stores/             # Estado global Zustand
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utilidades
│   ├── assets/                 # Recursos (imágenes, fonts)
│   ├── docs/                   # Documentación
│   ├── package.json
│   └── tsconfig.json
│
└── FacadeApi/                  # 🚀 BACKEND - API REST
    ├── Domain/                 # Capa de dominio
    │   └── Entities/           # Entidades del negocio
    ├── Application/            # Capa de aplicación
    │   ├── DTOs/               # Data Transfer Objects
    │   ├── Interfaces/         # Contratos
    │   └── Services/           # Lógica de negocio
    ├── Infrastructure/         # Capa de infraestructura
    │   ├── Context/            # DbContext
    │   ├── Repositories/       # Implementación repos
    │   ├── Migrations/         # Migraciones EF
    │   ├── JWT/                # Autenticación
    │   ├── AWS/                # Integración S3
    │   └── Mapper/             # AutoMapper profiles
    ├── FacadeApi/              # Capa de presentación
    │   ├── Controllers/        # Endpoints API
    │   ├── Middleware/         # Middleware custom
    │   ├── Program.cs          # Entry point
    │   └── Dockerfile          # Imagen Docker
    ├── UnitTest/               # Tests unitarios
    └── docs/                   # Documentación técnica
```

---

## ⚙️ Requisitos Previos

### Para Desarrollo Frontend
- **Node.js** 18+ y npm/yarn
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (para emulador Android) o **Xcode** (para iOS)
- Dispositivo físico con **Expo Go** app

### Para Desarrollo Backend
- **.NET SDK** 8.0+
- **Docker Desktop** y Docker Compose
- **PostgreSQL** (si desarrollo local sin Docker)
- **Visual Studio 2022** o **Rider** (recomendado)

### General
- **Git**
- Cuenta de **Supabase** (para autenticación)
- Cuenta **AWS** (opcional, para S3)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd S02-26
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=equiapp_db

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=tu_password_minio
MINIO_BUCKET_NAME=equiapp-storage

# .NET API
DATABASE_CONNECTION=Server=db;Port=5432;Database=equiapp_db;User Id=postgres;Password=tu_password_seguro
SUPABASE_JWT_SECRET=tu_supabase_jwt_secret
SUPABASE_PROJECT_URL=https://tu-proyecto.supabase.co

# AWS (opcional)
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
```

### 3. Instalar Dependencias Frontend

```bash
cd equiApp
npm install
```

Crea `.env` en `equiApp/`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
EXPO_PUBLIC_API_URL=http://localhost:8082/api
```

### 4. Configurar Backend

El backend se configura automáticamente con Docker Compose, pero puedes compilarlo localmente:

```bash
cd FacadeApi
dotnet restore
dotnet build
```

---

## 🎮 Configuración

### Configurar Supabase

1. Ve a [Supabase](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings** > **API** y copia:
   - Project URL
   - anon/public key
   - JWT Secret (Settings > API > JWT Settings)
4. Actualiza las variables de entorno

### Configurar Base de Datos

Las migraciones se aplican automáticamente al iniciar la API. Incluye:
- Sistema de productos y variantes
- Sistema de usuarios y roles
- Sistema de medidas
- Sistema de medios (imágenes)
- Relaciones y auditoría

---

## ▶️ Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down
```

Servicios disponibles:
- **PostgreSQL**: `localhost:5432`
- **API**: `http://localhost:8082` (HTTP) y `https://localhost:8083` (HTTPS)
- **MinIO Console**: `http://localhost:9003`
- **MinIO API**: `http://localhost:9002`

### Opción 2: Desarrollo Local

#### Backend
```bash
cd FacadeApi/FacadeApi
dotnet run
```

#### Frontend
```bash
cd equiApp

# Iniciar Metro bundler
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo macOS)
npm run ios

# Ejecutar en web
npm run web
```

### Acceder a la Documentación API

Una vez la API esté corriendo:
- **Swagger/Scalar**: `http://localhost:8082/scalar/v1`
- **OpenAPI JSON**: `http://localhost:8082/openapi/v1.json`

---

## 📚 Documentación

### Documentación Frontend (`equiApp/`)

- [AUTH_SETUP.md](equiApp/AUTH_SETUP.md) - Configuración completa de autenticación
- [TOKEN_EXCHANGE.md](equiApp/TOKEN_EXCHANGE.md) - Intercambio de tokens
- [VERSIONING.md](equiApp/VERSIONING.md) - Sistema de versionado
- [THEME-SYSTEM.md](equiApp/docs/THEME-SYSTEM.md) - Sistema de temas

### Documentación Backend (`FacadeApi/docs/`)

- [PROJECT-SUMMARY.md](FacadeApi/docs/PROJECT-SUMMARY.md) - Resumen del proyecto
- [ProductsAPI.md](FacadeApi/docs/ProductsAPI.md) - API de productos
- [Supabase-Authentication-Integration.md](FacadeApi/docs/Supabase-Authentication-Integration.md)
- [Users-And-Roles-System.md](FacadeApi/docs/Users-And-Roles-System.md)
- [ErrorHandling-Documentation.md](FacadeApi/docs/ErrorHandling-Documentation.md)
- [AutoMapper-Implementation.md](FacadeApi/docs/AutoMapper-Implementation.md)
- [StorageService-Summary.md](FacadeApi/docs/StorageService-Summary.md)
- Y más...

---

## 📊 Estado del Proyecto

### ✅ Completado

**Frontend:**
- ✅ Estructura del proyecto con Expo Router
- ✅ Sistema de autenticación con Supabase
- ✅ Manejo de estado (Zustand + React Query)
- ✅ Sistema de temas personalizable
- ✅ Validación de formularios (React Hook Form + Zod)
- ✅ Navegación con tabs
- ✅ Pantallas de onboarding
- ✅ Scripts de versionado automático

**Backend:**
- ✅ Clean Architecture implementada
- ✅ CRUD de productos con filtros avanzados
- ✅ Sistema de autenticación JWT + Supabase
- ✅ Sistema de usuarios y roles
- ✅ 6 migraciones de base de datos aplicadas
- ✅ Seeder con 15 productos y 61 variantes
- ✅ AutoMapper para DTOs
- ✅ Middleware de manejo de errores
- ✅ Documentación OpenAPI/Scalar
- ✅ Integración con AWS S3/MinIO

**Infraestructura:**
- ✅ Docker Compose configurado
- ✅ PostgreSQL 18 con pgvector
- ✅ MinIO para almacenamiento
- ✅ Sistema de logs y monitoreo

### 🚧 En Progreso / Futuro

- 🚧 Implementación completa UI de productos
- 🚧 Sistema de carrito de compras
- 🚧 Pasarela de pagos
- 🚧 Sistema de notificaciones push
- 🚧 Chat entre usuarios
- 🚧 Sistema de valoraciones y reseñas
- 🚧 Búsqueda avanzada con vectores (pgvector)
- 🚧 Panel de administración web

### 📈 Métricas

- **Líneas de código Backend**: ~1,510
- **Líneas de código Frontend**: ~2,000+ (estimado)
- **Tests unitarios**: En desarrollo
- **Cobertura de código**: TBD
- **Endpoints API**: 15+
- **Productos en catálogo**: 15 (seedeados)
- **Versión actual**: 1.1.0

---

## 🧪 Testing

```bash
# Backend - Tests unitarios
cd FacadeApi
dotnet test

# Frontend - Tests (cuando estén implementados)
cd equiApp
npm test
```

---

## 🔧 Scripts Útiles

### Frontend

```bash
# Versionado
npm run version:patch    # 1.1.0 → 1.1.1
npm run version:minor    # 1.1.0 → 1.2.0
npm run version:major    # 1.1.0 → 2.0.0

# Build Android
npm run build           # Release build
npm run build:patch     # Bump version + build
npm run build:debug     # Debug build

# Linting
npm run lint
```

### Backend

```bash
# Migraciones
dotnet ef migrations add NombreMigracion --project Infrastructure --startup-project FacadeApi/FacadeApi
dotnet ef database update --project Infrastructure --startup-project FacadeApi/FacadeApi

# Build
dotnet build --configuration Release
```

---

## 🤝 Contribución

Este es un proyecto de **No Country** - Simulación laboral S02-26.

### Equipo
- **Frontend**: Desarrolladores React Native
- **Backend**: Desarrolladores .NET
- **UI/UX**: Diseñadores
- **QA**: Testers

---

## 📄 Licencia

Proyecto privado - No Country Simulación Laboral

---

## 📞 Contacto y Soporte

Para preguntas o soporte, consulta la documentación en los directorios `docs/` o contacta al equipo del proyecto.

---

**Última actualización**: 27 de Febrero de 2026