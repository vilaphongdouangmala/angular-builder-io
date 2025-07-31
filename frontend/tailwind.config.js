/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-gray': '#F9F9FC',
        'neutrals-50': '#EAEAED',
        'neutrals-200': '#9DA0AB',
        'neutrals-300': '#707485',
        'neutrals-400': '#55596D',
        'neutrals-900': '#12141F',
        'blue-500': '#1958D3',
        'red-50': '#FFEBEA',
        'red-500': '#FF3B30',
        'black-500': '#1D1F2C',
        'gray-500': '#667085',
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
      }
    },
  },
  plugins: [],
}
