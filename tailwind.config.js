/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sidebar / brand navy (from Figma)
        navy: {
          50: '#eef2f7',
          100: '#d5deea',
          200: '#a9bcd2',
          300: '#7f9bb9',
          400: '#5c7ea1',
          500: '#3f6086',
          600: '#2a4a70',
          700: '#1f3b5d',
          800: '#183050',
          900: '#142a47',
          950: '#0f2038',
        },
        // Primary teal accent (from Figma)
        teal: {
          50: '#e8f6f5',
          100: '#cdeceb',
          200: '#9ddbd8',
          300: '#6cc7c3',
          400: '#38aeaa',
          500: '#1a9a96',
          600: '#168a86',
          700: '#126f6c',
          800: '#0f5856',
          900: '#0c4644',
        },
        ink: '#0f1b2d',
        surface: '#f7f9fb',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 27, 45, 0.04), 0 1px 3px rgba(15, 27, 45, 0.04)',
        pop: '0 20px 50px -12px rgba(15, 27, 45, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
