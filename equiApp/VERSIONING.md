# 📦 Sistema de Versionado Automático

Este proyecto utiliza versionado semántico automático siguiendo el formato `MAJOR.MINOR.PATCH`.

## 🔢 Formato de Versión

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Correcciones de bugs (1.0.0 → 1.0.1)
  │     └─────── Nuevas funcionalidades (1.0.0 → 1.1.0)
  └───────────── Cambios que rompen compatibilidad (1.0.0 → 2.0.0)
```

## 🚀 Uso

### Build Automático (Recomendado)

Cuando ejecutas el comando de build, **automáticamente incrementa la versión MINOR**:

```bash
npm run build
```

Esto:
1. ✅ Incrementa la versión minor (ej: 1.0.0 → 1.1.0)
2. ✅ Actualiza `package.json`, `app.json` y `android/app/build.gradle`
3. ✅ Incrementa el `versionCode` de Android
4. ✅ Ejecuta el build de la aplicación

### Incremento Manual

Si necesitas incrementar la versión sin hacer build:

```bash
# Incrementar PATCH (correcciones: 1.0.0 → 1.0.1)
npm run version:patch

# Incrementar MINOR (funcionalidades: 1.0.0 → 1.1.0)
npm run version:minor

# Incrementar MAJOR (cambios importantes: 1.0.0 → 2.0.0)
npm run version:major
```

## 📁 Archivos Actualizados

El script actualiza automáticamente:

### 1. `package.json`
```json
{
  "version": "1.1.0"
}
```

### 2. `app.json`
```json
{
  "expo": {
    "version": "1.1.0"
  }
}
```

### 3. `android/app/build.gradle`
```groovy
defaultConfig {
    versionCode 2        // Se incrementa automáticamente
    versionName "1.1.0"  // Se sincroniza con package.json
}
```

## 🎯 Cuándo Usar Cada Tipo

| Tipo    | Cuándo usar                                      | Ejemplo                  |
|---------|--------------------------------------------------|--------------------------|
| **Patch** | Bug fixes, correcciones menores                 | 1.0.0 → 1.0.1           |
| **Minor** | Nuevas funcionalidades (default en build)       | 1.0.0 → 1.1.0           |
| **Major** | Cambios que rompen compatibilidad               | 1.0.0 → 2.0.0           |

## 📝 Ejemplo de Flujo

```bash
# Versión actual: 1.0.0

# Desarrollo de nueva funcionalidad
npm run build
# → Versión: 1.1.0

# Otra funcionalidad
npm run build
# → Versión: 1.2.0

# Bug fix urgente
npm run version:patch
# → Versión: 1.2.1

# Nueva versión mayor (cambios importantes)
npm run version:major
# → Versión: 2.0.0
```

## 💡 Notas

- El script `prebuild` se ejecuta automáticamente antes de `build`
- El `versionCode` de Android se incrementa en +1 cada vez
- Todos los archivos se actualizan sincronizadamente
- Los cambios se pueden commitear juntos en Git

## 🔍 Ver Versión Actual

```bash
# En package.json
cat package.json | grep version

# En app.json
cat app.json | grep version

# En Android
cat android/app/build.gradle | grep version
```
