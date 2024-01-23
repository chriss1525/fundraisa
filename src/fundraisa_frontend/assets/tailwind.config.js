/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/*.{html,js}',
    // './components/**/*.{html,js}'
  ],
  purge: [
    './assets/*.html',
    // './components/**/*.{html,js}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
     extend: {},
  },
  variants: {
     extend: {},
  },
  plugins: [],
 }
