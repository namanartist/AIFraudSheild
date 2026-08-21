/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#030712',
        surface: {
          950: '#070c1a',
          900: '#0c142b',
          850: '#111b3b',
          800: '#17244d',
          700: '#23346b',
        },
        cyber: {
          cyan: '#00f0ff',
          teal: '#14b8a6',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          rose: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glowCyan: '0 0 25px -5px rgba(0, 240, 255, 0.4)',
        glowPurple: '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        glowRose: '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        glowEmerald: '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
