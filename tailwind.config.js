/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70-30': '70% 30%',
      },
      extend: {
        colors: {
          gradient: {
            start: '#0072FF', //blue
            end: '#00C853', //green
          },
        },
      },
    },
  },
  plugins: [],
}
