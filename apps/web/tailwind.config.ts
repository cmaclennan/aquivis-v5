import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2090C3',
          600: '#1878A3',
          50: '#E6F4FA',
        },
        neutral: {
          900: '#0A0A0B',
          700: '#3A3B3D',
          300: '#D2D4D7',
          100: '#F4F5F6',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        card: '14px',
        control: '8px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
export default config

