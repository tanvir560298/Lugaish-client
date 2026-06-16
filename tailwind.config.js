export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070b18',
        surface: 'rgba(13, 18, 30, 0.7)',
        surfaceSoft: 'rgba(13, 18, 30, 0.5)',
        accentBlue: '#3b82f6',
        accentGreen: '#10b981',
        accentPurple: '#c084fc',
        accentOrange: '#f59e0b',
      },
      boxShadow: {
        soft: '0 25px 80px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
