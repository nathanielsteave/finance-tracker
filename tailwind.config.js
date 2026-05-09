/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.15)',
        glassBorder: 'rgba(255, 255, 255, 0.3)',
        glassDark: 'rgba(30, 30, 30, 0.6)',
        accent: '#007AFF',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
}