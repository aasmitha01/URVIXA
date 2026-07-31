/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        urvixa: {
          primary: '#5CCB78',
          secondary: '#86E39A',
          lightGreen: '#DFF8E7',
          lightBlue: '#E0F2FE',
          iceBlue: '#7DD3FC',
          skyBlue: '#38BDF8',
          accentBlue: '#0284C7',
          bg: '#F4FAF7',
          accent: '#2E8B57',
          text: '#0F172A',
          darkShade: '#1E293B',
          muted: '#475569',
        },
        brand: {
          50: '#F4FAF7',
          100: '#DFF8E7',
          200: '#E0F2FE',
          300: '#7DD3FC',
          400: '#5CCB78',
          500: '#2E8B57',
          600: '#0284C7',
          700: '#1E293B',
          800: '#0F172A',
          900: '#030712',
        },
        canvas: '#F4FAF7',
      },
      fontFamily: {
        sans: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '24': '24px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 10px 32px 0 rgba(15, 23, 42, 0.08), 0 2px 10px 0 rgba(56, 189, 248, 0.12)',
        'glass-hover': '0 20px 48px 0 rgba(15, 23, 42, 0.14), 0 6px 20px 0 rgba(92, 203, 120, 0.18)',
        'tahoe-black': '0 25px 50px -12px rgba(15, 23, 42, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
        'black-shade': '0 12px 30px -4px rgba(15, 23, 42, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '14px',
        'xl': '22px',
        '2xl': '32px',
      }
    },
  },
  plugins: [],
};
