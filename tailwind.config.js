const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        spaceMono: ["SpaceMono", "monospace"]
      }
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // 😎 similar to `@apply`
        '.flex-center': `justify-center items-center`,
        '.body-text': `font-spaceMono leading-relaxed tracking-wide text-slate-800 text-lg`,
      });
    }),
  ],
}

