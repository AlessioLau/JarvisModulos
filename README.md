# 🤖 Jarvis - Módulo Diario / Rutina Diaria

Primer módulo de la suite de organización integral **Jarvis**, diseñado con una estética compacta, táctil y visualmente gamificada inspirada en los **widgets de Duolingo para celular**.

---

## ✨ Características Principales

### 1. 🎯 División del Día en 3 Bloques
- **📌 Tareas Obligatorias:** Metas esenciales del día (ej: *5hs de Estudio / Programación*, *Rutina de Salud*). Incluyen contadores numéricos y de horas con barra de progreso interactiva (+ / -).
- **🎁 Recompensas & Ocio (Protocolo con Candado 🔒):** Beneficios desbloqueables (ej: *3hs de Gaming / Videojuegos*, *Cine / Series*, *Tiempo Libre*).
  - **Mecánica de Desbloqueo:** Si intentas acceder a las recompensas antes de cumplir tus tareas obligatorias, el candado vibra con un aviso y sonido de advertencia.
  - Al completar el 100% de las obligatorias: **¡Explosión de confeti, fanfarria sonora y desbloqueo total!** Las recompensas cambian a estado brillante 🔓 para ser reclamadas con satisfacción.
- **🌟 Tareas Opcionales:** Hábitos complementarios (ej: *Lectura de desarrollo personal*, *Hidratación*, *Organización*).

### 2. 📅 Calendario con Histórico y Rachas (Streaks 🔥)
- **Contador de Racha Duolingo:** Sigue tus días consecutivos cumpliendo tus metas obligatorias con el icono de fuego 🔥.
- **Récord Histórico:** Muestra tu mejor racha de todos los tiempos y los días totales completados al 100%.
- **Navegación Histórica:** Puedes viajar en el tiempo a cualquier día anterior o futuro para revisar qué hiciste o registrar actividades pasadas.
- **Copias de Seguridad:** Opciones integradas para **Exportar** e **Importar** tu histórico en formato JSON.

### 3. 🔊 Sonidos Sintetizados (Web Audio API)
- Chime de checkmark alegre al estilo Duolingo.
- Fanfarria triunfal al desbloquear las recompensas.
- Toque táctil y boop de candado cerrado cuando las recompensas siguen bloqueadas.
- Botón para silenciar o reactivar sonidos con un solo clic.

### 4. 📱 Modos de Visualización
- **Modo Widget Móvil:** Marco compacto con proporciones de celular, idéntico al widget de Duolingo en pantalla de inicio.
- **Modo Expandido:** Vista ampliada de panel de control para pantallas de escritorio.
- **Avatar Jarvis Reactivo:** Un asistente inteligente holográfico que te habla y cambia de expresión según tu progreso diario.

---

## 🚀 Cómo Iniciar la Aplicación

Para abrir la aplicación en tu navegador:

```bash
npm run dev
```

Luego abre la URL local en tu navegador:
👉 **http://localhost:5173**

---

## 🛠️ Tecnologías Utilizadas
- **React 18 & TypeScript**
- **Vite** (rápido y optimizado)
- **Tailwind CSS** con sombras 3D y animaciones personalizadas
- **Lucide React** (iconografía limpia y moderna)
- **Canvas-Confetti** (animaciones de celebración)
- **Date-fns** (cálculo de fechas y rachas)
- **Web Audio API** (efectos de sonido nativos sin archivos externos)

