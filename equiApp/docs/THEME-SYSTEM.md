# Sistema de Temas - EquiApp

Sistema completo de temas con soporte para modo claro y oscuro, inspirado en las mejores prácticas de Expo.

## 📁 Estructura

```
src/
├── constants/
│   └── theme.ts          # Definiciones de colores y constantes
├── hooks/
│   ├── useColorScheme.ts # Hook para detectar tema del sistema
│   └── useThemeColor.ts  # Hook para obtener colores según tema
└── components/
    └── ui/
        ├── ThemedView.tsx  # View con tema automático
        └── ThemedText.tsx  # Text con tema automático
```

## 🎨 Colores Disponibles

### Paleta Completa
- `text` - Color primario de texto
- `textSecondary` - Color secundario de texto
- `background` - Color de fondo principal
- `backgroundSecondary` - Color de fondo secundario
- `tint` - Color de acento/tinte
- `icon` - Color de iconos
- `tabIconDefault` - Color de íconos de tabs inactivos
- `tabIconSelected` - Color de íconos de tabs activos
- `border` - Color de bordes
- `card` - Color de tarjetas
- `primary` - Color primario (#007AFF / #0A84FF)
- `secondary` - Color secundario
- `success` - Color de éxito
- `warning` - Color de advertencia
- `error` - Color de error
- `info` - Color de información

## 🔧 Uso

### 1. Hook useColorScheme

Detecta el tema del sistema:

```tsx
import { useColorScheme } from '@/src/hooks';

function MyComponent() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  
  return (
    <Text>Tema actual: {colorScheme}</Text>
  );
}
```

### 2. Hook useThemeColor

Obtiene colores según el tema:

```tsx
import { useThemeColor } from '@/src/hooks';

function MyComponent() {
  // Opción 1: Usar color del tema
  const backgroundColor = useThemeColor({}, 'background');
  
  // Opción 2: Sobrescribir con colores personalizados
  const customColor = useThemeColor(
    { light: '#fff', dark: '#000' },
    'background'
  );
  
  return <View style={{ backgroundColor }} />;
}
```

### 3. ThemedView Component

View que ajusta automáticamente su backgroundColor:

```tsx
import { ThemedView } from '@/src/components/ui';

// Uso básico - usa el color 'background' del tema
<ThemedView style={{ flex: 1 }}>
  <Text>Contenido</Text>
</ThemedView>

// Con colores personalizados
<ThemedView 
  lightColor="#f5f5f5" 
  darkColor="#1c1c1e"
  style={{ padding: 16 }}
>
  <Text>Contenido</Text>
</ThemedView>
```

### 4. ThemedText Component

Text con soporte para temas y variantes de estilo:

```tsx
import { ThemedText } from '@/src/components/ui';

// Uso básico
<ThemedText>Texto normal</ThemedText>

// Con variantes
<ThemedText type="title">Título Grande</ThemedText>
<ThemedText type="subtitle">Subtítulo</ThemedText>
<ThemedText type="defaultSemiBold">Texto en negrita</ThemedText>
<ThemedText type="link">Enlace</ThemedText>

// Con colores personalizados
<ThemedText lightColor="#000" darkColor="#fff">
  Texto personalizado
</ThemedText>
```

## 🎯 Variantes de ThemedText

- `default` - Texto normal (16px, altura línea 24)
- `title` - Título grande (32px, negrita, altura línea 40)
- `subtitle` - Subtítulo (20px, semi-negrita, altura línea 28)
- `defaultSemiBold` - Texto normal semi-negrita (16px, altura línea 24)
- `link` - Estilo de enlace (16px, color azul)

## 🚀 Splash Screen y Carga de Fuentes

El sistema automáticamente:
1. Muestra el splash screen nativo al iniciar
2. Carga las fuentes personalizadas (si las hay)
3. Oculta el splash cuando todo está listo
4. Inicializa la autenticación y servicios

### Agregar Fuentes Personalizadas

En `app/_layout.tsx`:

```tsx
const [fontsLoaded] = useFonts({
  'CustomRegular': require('../assets/fonts/CustomRegular.ttf'),
  'CustomBold': require('../assets/fonts/CustomBold.ttf'),
});
```

## 🎨 Constantes Adicionales

### Spacing
```tsx
import { Spacing } from '@/src/constants';

<View style={{ padding: Spacing.md }} /> // 16px
```

Valores: `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `xxl` (48)

### Border Radius
```tsx
import { BorderRadius } from '@/src/constants';

<View style={{ borderRadius: BorderRadius.lg }} /> // 12px
```

Valores: `sm` (4), `md` (8), `lg` (12), `xl` (16), `full` (9999)

### Fonts
```tsx
import { Fonts } from '@/src/constants';

<Text style={{ fontFamily: Fonts.sans }} />
```

## 📱 ThemeProvider

El `ThemeProvider` de React Navigation está integrado en `app/_layout.tsx` y automáticamente:
- Detecta el tema del sistema
- Aplica el tema correcto a la navegación
- Actualiza el StatusBar según el tema

## ✨ Mejores Prácticas

1. **Usa componentes Themed** para elementos que deben adaptarse al tema
2. **Usa useThemeColor** para estilos personalizados que necesiten cambiar con el tema
3. **Define colores en theme.ts** en lugar de hardcodearlos
4. **Usa las constantes** (Spacing, BorderRadius) para consistencia

## 🔄 Cambio de Tema

El tema cambia automáticamente según la configuración del sistema operativo. No es necesario código adicional.

Para forzar un tema específico, puedes modificar el `userInterfaceStyle` en `app.json`:
- `"automatic"` - Sigue el tema del sistema (recomendado)
- `"light"` - Siempre modo claro
- `"dark"` - Siempre modo oscuro
