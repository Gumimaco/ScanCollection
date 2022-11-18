/** @type {import('tailwindcss').Config} */
process.env.NODE_ENV === "production"
module.exports = {
  content: ["./src/components/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}","./src/index.tsx"],
  theme: {
    extend: {
      spacing: {
        112: '28rem',
      },
      colors:{
        'pearl': '#D9D9D9',
        'dark-gray':'#222222',
        'dark-dark-gray':'#1C1C1C'
      },
    },
  },
  plugins: [],
}
