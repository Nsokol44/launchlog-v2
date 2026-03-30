/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#fdf8f2',
        'warm-white': '#fff9f4',
        coral: {
          DEFAULT: '#ff7b5c',
          50: '#fff5f2',
          100: '#ffe8e2',
          200: '#ffd4c8',
          500: '#ff7b5c',
          600: '#e8604a',
          700: '#c44835',
        },
        sage: '#a8c5a0',
        peach: '#ffb38a',
        border: '#ecddd4',
        muted: '#7a6e68',
        ink: '#2d2420',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 8px 32px rgba(45,36,32,0.10)',
        'card-lg': '0 20px 60px rgba(45,36,32,0.15)',
        coral: '0 4px 16px rgba(255,123,92,0.4)',
      },
    },
  },
  plugins: [],
}
