export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--campus-bg)',
        surface: 'var(--campus-surface)',
        surfaceSoft: 'var(--campus-surface-raised)',
        accentBlue: '#245640',
        accentGreen: '#245640',
        accentPurple: '#c6a46c',
        accentOrange: '#76571f',
      },
      boxShadow: {
        soft: 'var(--campus-shadow)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
