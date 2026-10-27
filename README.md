# 🤖 Suite de Módulos Jarvis

Repositorio central con los diferentes módulos independientes de productividad y organización integral del ecosistema **Jarvis**.

---

## 📂 Módulos Actuales

### 1. [`ModuloCalendario`](./ModuloCalendario)
- **Propósito:** Rutina diaria, seguimiento de hábitos y sistema de recompensas gamificado inspirado en los widgets de Duolingo.
- **Características:**
  - 📌 División del día en Tareas Obligatorias, Opcionales y Recompensas desbloqueables.
  - 🏋️‍♂️ Programación de tareas según días de la semana (ej: Gym 3 días a la semana).
  - 🔒 Bóveda de Recompensas con candado y desbloqueo mediante celebración (confeti y fanfarria sonora).
  - 📅 Calendario mensual integrado con cálculo de rachas (streaks 🔥).
  - 📱 Soporte PWA para instalarlo como App nativa en el celular.
  - 💻 Command Center de 3 columnas optimizado para PC.
- **Tecnologías:** React, TypeScript, Vite, Tailwind CSS, Web Audio API, Service Worker.

---

## 🚀 Cómo Deployar `ModuloCalendario` en Vercel

Cuando subas este repositorio a GitHub y lo vincules en **[Vercel](https://vercel.com)**:

1. En el panel de Vercel, haz clic en **"Add New Project"** y selecciona tu repositorio de GitHub `ModulosJarvis`.
2. En la sección **Root Directory**, haz clic en **"Edit"** y selecciona la carpeta **`ModuloCalendario`**.
3. Deja la configuración de compilación por defecto (Vercel detectará Vite automáticamente: `npm run build` y directorio `dist`).
4. Haz clic en **"Deploy"**.
5. ¡Listo! Vercel te entregará una URL HTTPS segura (ej: `https://tu-jarvis.vercel.app`).
   - Al abrirla desde tu celular, el navegador te mostrará de inmediato el botón para **Instalar la PWA** en la pantalla de inicio.
