/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans-serif': ['Inter', 'sans-serif'],
        'signature': ['SignatureScript', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wobble': 'wobble 2s ease-in-out infinite',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
         shimmer: {
        '100%': { transform: 'translateX(100%)' },
      },
      },
    },
  },
  plugins: [
   scrollbarHide
  ]
}


