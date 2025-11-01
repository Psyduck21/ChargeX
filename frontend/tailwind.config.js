/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 🌤 Light Theme
        background: '#F7F8F9',
        card: '#FFFFFF',
        sidebar: '#F0F3F2',
        primary: {
          DEFAULT: '#007F5F',
          light: '#C6F0DA',
          dark: '#006B4F'
        },
        secondary: {
          DEFAULT: '#00B47D',
          light: '#E6F7F1',
          dark: '#009B6A'
        },
        hover: '#C6F0DA',
        border: '#E5E7EB',
        text: {
          primary: '#1E1E1E',
          secondary: '#6C757D'
        },
        warning: '#FFB020',
        danger: '#E63946',
        info: '#1E88E5',
        success: '#00B47D',
        muted: '#6C757D',
        accent: '#00B47D',
        surface: '#FFFFFF',

        // 🌙 Dark Theme
        dark: {
          background: {
            DEFAULT: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
          },
          surface: {
            DEFAULT: '#1e293b',
            secondary: '#334155',
            tertiary: '#475569',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            tertiary: '#94a3b8',
          },
          border: '#334155',
        },
      },

      fontFamily: {
        sans: [
          'Poppins',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],primary,
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },

      fontWeight: {
        heading: 600,
        body: 400,
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
      },

      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(217, 70, 239, 0.5)',
        elevated: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        soft: '0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)
        `,
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'slide-out': 'slideOut 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 1s infinite',
        shimmer: 'shimmer 2s linear infinite',
        gradient: 'gradient 15s ease infinite',
      },

      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut: { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        slideIn: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideOut: { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(-10px)', opacity: '0' } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        scaleOut: { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(0.95)', opacity: '0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 5px rgba(59,130,246,0.5)' }, '50%': { boxShadow: '0 0 20px rgba(59,130,246,0.8)' } },
        bounceSubtle: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-2px)' } },
        shimmer: { '0%': { backgroundPosition: '0% 0%' }, '100%': { backgroundPosition: '200% 0%' } },
        gradient: { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },

      screens: {
        xs: '475px',
      },
    },

    container: {
      center: true,
      padding: '1rem',
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};
