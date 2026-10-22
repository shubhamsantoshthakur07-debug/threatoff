/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: "#070b14",
          surface: "#0d1322",
          card: "#121a2d",
          cardBorder: "#1e2a44",
          cardHover: "#182239",
          cyan: "#00e5ff",
          cyanMuted: "#0284c7",
          electric: "#38bdf8",
          critical: "#ef4444",
          criticalBg: "rgba(239, 68, 68, 0.12)",
          warning: "#f59e0b",
          warningBg: "rgba(245, 158, 11, 0.12)",
          success: "#10b981",
          successBg: "rgba(16, 185, 129, 0.12)",
          textMuted: "#94a3b8"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(0, 229, 255, 0.3)',
        'red-glow': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'amber-glow': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
