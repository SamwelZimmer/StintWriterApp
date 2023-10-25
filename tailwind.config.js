/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#130101',
        'text-dark': '#FEECEC',
        'background': '#ffffff',
        'background-dark': '#000000',
        'primary': '#0ba2a2',
        'primary-dark': '#5DF4F4',
        'secondary': '#a9a9f9',
        'secondary-dark': '#060656',
        'accent': '#0ec8c8',
        'accent-dark': '#37F1F1',
        'card-dark': '#090e1a'
       },
    },
  },
  plugins: [],
}