/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.zh.html',
    './admin.html',
    './post.html',
    './apps/**/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // keep existing styles; do not apply Tailwind reset
  },
};