/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0e14',
        darkCard: '#151a24',
        darkBorder: '#232b3b',
        accentGold: '#d97706',
        accentCyan: '#06b6d4',
        accentEmerald: '#10b981',
        accentRose: '#f43f5e',
      },
    },
  },
  plugins: [],
};
