/** @type {import('tailwindcss').Config} */
// Binary Cybernetic Engine — Pages 2.1 design system (source: Codigo binario Pages 2.1/binary_cybernetic_engine/DESIGN.md)
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/globals.css',
  ],
  theme: {
    extend: {
      colors: {
        // ── Surface system ──
        surface: '#051424',
        'surface-dim': '#051424',
        'surface-bright': '#2c3a4c',
        'surface-container-lowest': '#010f1f',
        'surface-container-low': '#0d1c2d',
        'surface-container': '#122131',
        'surface-container-high': '#1c2b3c',
        'surface-container-highest': '#273647',
        'surface-variant': '#273647',
        'bg-canvas': '#080C0E',
        'bg-surface-base': '#0B0F12',
        'bg-surface-elevated': '#10171B',
        'bg-surface-overlay': '#162026',
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#bacbbe',
        'inverse-surface': '#d4e4fa',
        'inverse-on-surface': '#233143',
        'surface-tint': '#00e297',

        // ── Text hierarchy ──
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#475569',

        // ── Borders ──
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-highlight': 'rgba(0, 229, 153, 0.35)',

        // ── Primary (controlled emerald mint) ──
        primary: '#6dffba',
        'on-primary': '#003822',
        'primary-container': '#00e599',
        'on-primary-container': '#00613e',
        'primary-fixed': '#4dffb2',
        'primary-fixed-dim': '#00e297',
        'on-primary-fixed': '#002112',
        'on-primary-fixed-variant': '#005234',
        'inverse-primary': '#006c46',

        // ── Secondary (deep cybernetic cyan) ──
        secondary: '#4cd6fb',
        'on-secondary': '#003642',
        'secondary-container': '#00b2d6',
        'on-secondary-container': '#003f4e',
        'secondary-fixed': '#b3ebff',
        'secondary-fixed-dim': '#4cd6fb',
        'on-secondary-fixed': '#001f27',
        'on-secondary-fixed-variant': '#004e5f',

        // ── Tertiary (synthetic green) ──
        tertiary: '#72fec0',
        'on-tertiary': '#003824',
        'tertiary-container': '#51e1a5',
        'on-tertiary-container': '#006141',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',

        // ── Error ──
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',

        outline: '#849589',
        'outline-variant': '#3b4a41',

        // Glows
        'system-emerald-glow': 'rgba(0, 229, 153, 0.12)',
        'system-cyan-glow': 'rgba(0, 180, 216, 0.14)',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        space: '1rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '3rem',
        'margin-mobile': '1.25rem',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        display: ['Geist', 'sans-serif'],
        'headline-lg': ['Geist', 'sans-serif'],
        'headline-md': ['Geist', 'sans-serif'],
        'headline-sm': ['Geist', 'sans-serif'],
        'label-code': ['JetBrains Mono', 'monospace'],
        'label-telemetry': ['JetBrains Mono', 'monospace'],
        'label-counter': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '64px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.025em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'label-code': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
        'label-telemetry': ['11px', { lineHeight: '14px', letterSpacing: '0.08em', fontWeight: '600' }],
        'label-counter': ['14px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '700' }],
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        glow: 'inset 0 0 8px rgba(0, 229, 153, 0.35)',
        'cta-glow': '0 0 16px rgba(0, 229, 153, 0.2)',
        'cta-glow-lg': '0 0 24px rgba(0, 229, 153, 0.3)',
        navbar: '0 1px 8px rgba(0, 0, 0, 0.08)',
        card: '0 10px 30px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
