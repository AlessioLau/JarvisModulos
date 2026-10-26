/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          cyan: '#06b6d4',
          neon: '#22d3ee',
          duoGreen: '#58cc02',
          duoGreenDark: '#46a302',
          duoYellow: '#ffc800',
          duoOrange: '#ff9600',
          duoBlue: '#1cb0f6',
          duoPurple: '#ce82ff',
          duoRed: '#ff4b4b'
        }
      },
      boxShadow: {
        'duo-green': '0 4px 0 #46a302',
        'duo-yellow': '0 4px 0 #e5a500',
        'duo-blue': '0 4px 0 #1899d6',
        'duo-purple': '0 4px 0 #a855f7',
        'duo-gray': '0 4px 0 #334155',
        'duo-active': '0 1px 0 #334155'
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.9))' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' }
        }
      },
      animation: {
        bounceSubtle: 'bounceSubtle 2s infinite ease-in-out',
        pulseGlow: 'pulseGlow 2.5s infinite ease-in-out',
        shake: 'shake 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
}

