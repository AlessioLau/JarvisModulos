# 🤖 Jarvis - Módulo Diario / Rutina Diaria

Primer módulo de la suite de organización integral **Jarvis**, diseñado con soporte **PWA (Progressive Web App)** para celulares y una interfaz especializada **Command Center para PC**.

---

## ✨ Interfaces Adaptativas

### 📱 1. En Celular (Progressive Web App - Estilo Widget Duolingo)
- **Instalable en la pantalla de inicio:** Funciona como una aplicación nativa completa, sin barras de navegación del navegador (`standalone mode`).
- **Diseño compacto táctil:** Proporciones idénticas al widget de Duolingo de Android/iOS.
- **Modo Offline:** Incluye Service Worker para funcionar incluso sin conexión a internet.
- **Aviso de instalación directo:** Al abrirla en tu celular, aparece un banner para instalar con un solo clic.

### 💻 2. En PC (Command Center Dashboard)
Una interfaz pensada para aprovechar el ancho del monitor con un panel de 3 columnas:
- **Columna Izquierda (Asistente & Navegación):**
  - Holograma / Núcleo de Jarvis reactivo.
  - **Mini Calendario Mensual integrado:** Viaja a cualquier día del mes con un solo clic directamente desde la pantalla.
  - Métricas de racha Duolingo (Racha actual 🔥, récord histórico 🏆, días 100% completados).
  - Exportación e importación de backups JSON.
- **Columna Central (Metas & Hábitos):**
  - Selector de fecha y barra de progreso animada.
  - **Tareas Obligatorias:** Contadores de horas táctiles (`+` / `-`), asignación de días específicos (ej: *Gym Lun, Mié, Vie*).
  - **Tareas Opcionales & Hábitos:** Lectura, agua, meditación.
- **Columna Derecha (Bóveda de Recompensas):**
  - Panel interactivo con estado del protocolo en vivo (**🔒 ACCESO DENEGADO** vs **🔓 ACCESO AUTORIZADO**).
  - Recompensas canjeables (Gaming, Cine, Salidas) con efectos de sonido arcade y confeti.
  - Registro de recompensas ya disfrutadas en el día.
- **Botón `📱 Vista Celular`:** Puedes alternar entre la vista de PC y la vista widget de celular cuando quieras.

---

## 📲 Cómo Usar e Instalar en tu Celular

1. Inicia el servidor con acceso a tu red local:
   ```bash
   npm run dev -- --host
   ```
2. Vite te mostrará tu dirección de red local (ejemplo: `http://192.168.1.15:5173`).
3. Abre esa dirección en el navegador de tu celular (conectado al mismo Wi-Fi):
   - **En Android (Chrome):** Toca el botón flotante **"Instalar Jarvis en tu celular"** o en el menú de Chrome selecciona *"Agregar a la pantalla principal"*.
   - **En iPhone (Safari):** Toca el botón de *Compartir* (cuadrado con flecha) y selecciona *"Agregar al inicio"*.
4. ¡Listo! Se abrirá como una aplicación nativa con su icono oficial de Jarvis.

---

## 🛠️ Tecnologías
- **PWA Nactiva:** Service Worker (`sw.js`), `manifest.json`, iconos adaptativos SVG/PNG (192x192, 512x512, Apple touch).
- **React 18 & TypeScript**
- **Vite 6**
- **Tailwind CSS**
- **Lucide React & Canvas-Confetti**
- **Web Audio API** (efectos de sonido nativos)
