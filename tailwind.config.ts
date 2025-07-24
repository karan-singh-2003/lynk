/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // your content paths
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
