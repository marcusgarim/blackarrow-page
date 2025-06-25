tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(216 100% 20%)',
        background: 'hsl(216 100% 5%)',
        foreground: 'hsl(0 0% 98%)',
        primary: '#0068ff',
        'primary-foreground': 'hsl(0 0% 100%)',
        secondary: '#0068ff',
        'secondary-foreground': 'hsl(0 0% 100%)',
        muted: 'hsl(216 100% 15%)',
        'muted-foreground': 'hsl(216 20% 70%)',
        accent: '#0068ff',
        'accent-foreground': 'hsl(0 0% 100%)',
      },
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
        heading: ['Archivo', 'sans-serif'],
      },
      animation: {
        'image-glow': 'image-glow 4s ease-out 0.6s forwards',
      },
      keyframes: {
        'image-glow': {
          '0%': {
            opacity: '0',
            'animation-timing-function': 'cubic-bezier(.74, .25, .76, 1)',
          },
          '10%': {
            opacity: '0.5',
            'animation-timing-function': 'cubic-bezier(.12, .01, .08, .99)',
          },
          '100%': { opacity: '0.7' },
        },
      },
    },
  },
};