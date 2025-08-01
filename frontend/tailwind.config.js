/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-gray': '#F9F9FC',
        'neutrals': {
          50: '#EAEAED',
          200: '#9DA0AB',
          300: '#707485',
          400: '#55596D',
          900: '#12141F',
        },
        'blue': {
          500: '#1958D3',
        },
        'red': {
          50: '#FFEBEA',
          500: '#FF3B30',
        },
        'black': {
          500: '#1D1F2C',
        },
        'gray': {
          500: '#667085',
        },
        'primary-teal': '#175252',
        'primary-teal-light': 'rgba(23, 82, 82, 0.10)',
      },
      fontFamily: {
        'bai-jamjuree': ['Bai Jamjuree', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'header': '0 1px 18px 0 rgba(181, 201, 235, 0.21), 0 3px 5px 0 rgba(132, 147, 198, 0.12)',
        'sidebar': '4px 0 30px 0 rgba(131, 98, 234, 0.05)',
        'panel': '0 4px 30px 0 rgba(46, 45, 116, 0.05)',
      },
      width: {
        '21': '5.25rem',
        '61': '15.25rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '87.75': '21.9375rem',
        '114.25': '28.5625rem',
      },
      height: {
        '15': '3.75rem',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-bg-gray',
    'font-bai-jamjuree',
    'shadow-header',
    'shadow-sidebar', 
    'shadow-panel',
    'bg-primary-teal',
    'bg-primary-teal-light',
    'text-primary-teal'
  ]
}
