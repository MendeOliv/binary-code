/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Terminal Noir palette
        background: '#0b1326',
        surface: '#111827',
        'surface-dim': '#0b1326',
        'surface-bright': '#31394d',
        'surface-container-lowest': '#060e20',
        'surface-container-low': '#131b2e',
        'surface-container': '#171f33',
        'surface-container-high': '#222a3d',
        'surface-container-highest': '#2d3449',
        'surface-elevated': '#1F2937',
        'surface-variant': '#2d3449',
        'surface-tint': '#4edea3',

        // Primary (emerald green)
        primary: '#4edea3',
        'primary-container': '#10b981',
        'primary-fixed': '#6ffbbe',
        'primary-fixed-dim': '#4edea3',
        'on-primary': '#003824',
        'on-primary-container': '#00422b',
        'on-primary-fixed': '#002113',
        'on-primary-fixed-variant': '#005236',
        'inverse-primary': '#006c49',

        // Secondary (muted blue-grey)
        secondary: '#b7c8e1',
        'secondary-container': '#3a4a5f',
        'secondary-fixed': '#d3e4fe',
        'secondary-fixed-dim': '#b7c8e1',
        'on-secondary': '#213145',
        'on-secondary-container': '#a9bad3',
        'on-secondary-fixed': '#0b1c30',
        'on-secondary-fixed-variant': '#38485d',

        // Tertiary (teal)
        tertiary: '#68dba9',
        'tertiary-container': '#3eb686',
        'tertiary-fixed': '#85f8c4',
        'tertiary-fixed-dim': '#68dba9',
        'on-tertiary': '#003825',
        'on-tertiary-container': '#00422c',
        'on-tertiary-fixed': '#002114',
        'on-tertiary-fixed-variant': '#005137',

        // Error
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        // Text & Outline
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#bbcabf',
        'on-background': '#dae2fd',
        'inverse-surface': '#dae2fd',
        'inverse-on-surface': '#283044',
        outline: '#86948a',
        'outline-variant': '#3c4a42',
        'border-subtle': '#334155',
      },

      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'headline-xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },

      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },

      boxShadow: {
        'hard': '4px 4px 0px #060e20',
        'glow': 'inset 0 0 4px rgba(16, 185, 129, 0.3)',
        'glow-strong': 'inset 0 0 8px rgba(16, 185, 129, 0.5)',
      },

      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-border': 'glowBorder 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowBorder: {
          '0%, 100%': { boxShadow: 'inset 0 0 4px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: 'inset 0 0 8px rgba(16, 185, 129, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
