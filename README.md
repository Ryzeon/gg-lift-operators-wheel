# 🎰 Ruleta de Asignaciones v2.0 - Sistema de Distribución de Puestos

Una aplicación web moderna y profesional con **Arquitectura Limpia** para distribuir automáticamente puestos de trabajo. Implementa animaciones avanzadas donde los nombres literalmente **vuelan desde la ruleta hacia sus puestos asignados**.

![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-cyan)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.3-pink)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green)

## ✨ Características v2.0

### 🏗️ Arquitectura Limpia
- **Separación de responsabilidades**: Componentes, hooks, utils y constants
- **Principios SOLID**: Código mantenible y escalable
- **Funciones puras**: Lógica de negocio testeable
- **Custom hooks**: Encapsulación de lógica compleja

### 🎭 Animaciones Profesionales Avanzadas
- 🎰 **Ruleta Multi-Capa**: Anillos concéntricos con rotación independiente
- 🚀 **Nombres Voladores**: Los nombres vuelan desde la ruleta hacia sus puestos
- ✨ **Efectos de Escala**: Crecimiento y reducción suaves durante el vuelo
- 🌈 **Color Coding**: Cada puesto tiene su color e icono distintivo
- 💫 **Staggered Animation**: Aparición escalonada de elementos
- 🎪 **Efectos Hover**: Interacciones fluidas en todos los elementos

### 🎨 Diseño Premium
- **Glassmorphism UI**: Efectos de vidrio con blur y transparencias
- **Gradientes Dinámicos**: Fondo animado con elementos blob
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Sistema de Colores**: Paleta vibrante y consistente
- **Efectos de Glow**: Resplandor según contexto

### 🎯 Funcionalidades Core
- ✅ Input de participantes multilínea
- ✅ Configuración de Lifts activos (A-E)
- ✅ Sistema de Rentals opcional
- ✅ Puestos fijos pre-asignables
- ✅ Distribución aleatoria inteligente
- ✅ Animación de ruleta de 4 segundos
- ✅ Reset y redistribución

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- npm 9+

### Instalación

```bash
# Navegar al directorio del proyecto
cd ruleta-lift

# Instalar dependencias (asegúrate de incluir dev dependencies)
npm install --include=dev

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Vista previa del build
npm run preview
```

## 📖 Cómo Usar

### 1. Ingresar Participantes
- En el panel de configuración, ingresa los nombres de los participantes (uno por línea)
- Haz clic en "Cargar Participantes"

### 2. Configurar Puestos
- **Lifts Activos**: Selecciona qué lifts (A-E) estarán activos
- **Rentals**: Marca la casilla si necesitas rentals y especifica la cantidad
- **Puestos Fijos** (opcional): Asigna participantes específicos a posiciones fijas antes de iniciar

### 3. Iniciar Ruleta
- Haz clic en "Iniciar Ruleta"
- Observa la animación de la ruleta (4 segundos)
- Los resultados aparecerán con animaciones escalonadas

### 4. Ver Resultados
- Cada puesto se muestra en una tarjeta colorida:
  - 🚡 **Lift A-E** (Azul): 2 personas por lift
  - ⛷️ **Sleeds** (Verde): 1 persona por lift activo
  - ⭐ **Extras A-E** (Púrpura): 1 persona por lift
  - 🎿 **Rentals** (Naranja): Cantidad configurada

### 5. Resetear
- Haz clic en "Resetear" para limpiar los resultados y comenzar de nuevo

## 🎨 Tecnologías Utilizadas

- **React 19**: Framework de UI moderno
- **Vite 7**: Build tool ultrarrápido
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion 12**: Librería de animaciones de alto rendimiento
- **Lucide React**: Iconos SVG modernos y optimizados

## 📁 Estructura del Proyecto (Arquitectura Limpia)

```
ruleta-lift/
├── src/
│   ├── components/          # Componentes presentacionales
│   │   ├── ConfigurationPanel.jsx
│   │   ├── RouletteWheel.jsx
│   │   ├── FlyingNames.jsx
│   │   └── ResultsGrid.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useRouletteDistribution.js
│   ├── utils/               # Funciones puras
│   │   └── distribution.js
│   ├── constants/           # Configuración
│   │   └── positions.js
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos del componente
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos estáticos
├── index.html               # HTML principal
├── vite.config.js           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
└── package.json             # Dependencias y scripts
```

## 🎬 Flujo de Animación

1. **Usuario inicia ruleta** → Configuración se oculta
2. **Ruleta aparece** → Fade in con scale
3. **Ruleta gira** → 4 segundos, 1440° (4 vueltas)
4. **Ruleta desaparece** → Fade out
5. **Nombres empiezan a volar** → Uno por uno desde el centro
6. **Cada nombre:**
   - Sale con scale 0
   - Crece a scale 1.2
   - Se normaliza a scale 1
   - Vuela hacia su tarjeta destino
   - Desaparece con fade out
7. **Tarjetas aparecen** → Animación escalonada
8. **Usuario puede interactuar** → Hover effects activos

## 🎯 Lógica de Distribución

El algoritmo de distribución sigue este orden:

1. **Filtrar participantes fijos**: Excluye a quienes ya tienen posición asignada
2. **Barajar aleatoriamente**: Mezcla los participantes disponibles
3. **Asignar a Lifts**: 2 personas por cada lift activo
4. **Asignar a Sleeds**: 1 persona por cada lift activo
5. **Asignar a Extras**: 1 persona por cada lift activo
6. **Asignar a Rentals**: Si está habilitado, distribuir según cantidad configurada

## 🎨 Animaciones Incluidas

- **Float Animation**: Efecto flotante en el título principal
- **Fade In/Out**: Transiciones suaves de entrada y salida
- **Scale**: Efectos de escala en botones y tarjetas
- **Rotate**: Animación de ruleta girando
- **Staggered**: Aparición escalonada de resultados
- **Hover Effects**: Interacciones al pasar el cursor

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Genera build de producción
npm run preview  # Vista previa del build
npm run lint     # Ejecuta ESLint
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para facilitar la distribución de puestos de trabajo.

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en el repositorio con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado
- Screenshots (si aplica)

---

**Versión 1.0** - Sistema de Distribución Automática de Puestos