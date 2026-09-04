/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/globals.css',
  ],
  theme: {
    extend: {
      colors: {
        // ===================================================================
        // DESIGN SYSTEM: kebab-case SEMANTIC TOKENS (source of truth — DESIGN.md)
        // Used by globals.css (@apply) and every component TSX.
        // Values preserved from DESIGN.md / original config — nothing invented.
        // ===================================================================
        // Surface System
        surface: '#0b1326',
        'surface-dim': '#0b1326',
        'surface-bright': '#31394e',
        'surface-container': '#171f33',
        'surface-container-low': '#131b2e',
        'surface-container-lowest': '#060d20',
        'surface-container-high': '#222a3e',
        'surface-container-highest': '#2d3449',
        'surface-variant': '#2d3449',
        'surface-charcoal': '#111827',
        'surface-elevated': '#1F2937',
        'on-surface': '#dbe2fd',
        'on-surface-variant': '#bbcabf',
        'inverse-surface': '#dbe2fd',
        'inverse-on-surface': '#283044',
        'surface-tint': '#4edea3',

        // Luminescent Primaries & Accents
        'intelligent-emerald': '#4edea3',
        'deep-emerald': '#10b981',
        'cyan-relay': '#06b6d4',
        'sapphire-vector': '#3b82f6',
        'amethyst-neural': '#a855f7',
        'emerald-accent': '#4edea3',

        // Structural / glass borders
        'border-glass': '#222a3e',
        structural: '#222a3e',
        'structural-border': '#222a3e',
        'border-subtle': '#334155',

        // Content & Readout
        'primary-text': '#dbe2fd',
        'light-emerald-text': '#d8f3dc',
        'text-high-contrast': '#d8f3dc',
        'muted-text': '#94a3b8',
        'matrix-metadata': '#bbcabf',

        // Semantic core
        background: '#0b1326',
        'on-background': '#dbe2fd',
        'on-primary': '#003824',
        primary: '#6ffbbe',
        'primary-container': '#4edea3',
        'on-primary-container': '#005f40',
        'inverse-primary': '#006c4a',
        secondary: '#4cd7f6',
        'on-secondary': '#003640',
        'secondary-container': '#03b5d3',
        'on-secondary-container': '#00424e',
        tertiary: '#f0daff',
        'on-tertiary': '#490080',
        'tertiary-container': '#ddb7ff',
        'on-tertiary-container': '#7715c5',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        'primary-fixed': '#6ffbbe',
        'primary-fixed-dim': '#4edea3',
        'on-primary-fixed': '#002114',
        'on-primary-fixed-variant': '#005236',
        outline: '#86948a',
        'outline-variant': '#3c4a42',
        void: '#060d20',

        // ===================================================================
        // Compatibility aliases (existing camelCase tokens — kept unchanged)
        // ===================================================================
        surfaceLow: '#111827',
        surfaceContainer: '#171f33',
        structuralBorder: '#222a3e',
        intelligentEmerald: '#4edea3',
        deepEmerald: '#10b981',
        cyanRelay: '#06b6d4',
        sapphireVector: '#3b82f6',
        amethystNeural: '#a855f7',
        primaryText: '#dbe2fd',
        lightEmeraldText: '#d8f3dc',
        mutedText: '#94a3b8',
        matrixMetadata: '#bbcabf',
        surfaceCharcoal: '#111827',
        surfaceBright: '#31394e',
        surfaceElevated: '#1F2937',
        surfaceVariant: '#2d3449',
        onBackground: '#dbe2fd',
        textPrimary: '#dbe2fd',
        textSecondary: '#94a3b8',
        textHighContrast: '#d8f3dc',
        onSurface: '#dbe2fd',
        onSurfaceVariant: '#bbcabf',
        outlineVariant: '#3c4a42',
      },
      borderRadius: {
        DEFAULT: '0',       // MANDATORY: Zero radius
        lg: '0',            // MANDATORY: Zero radius
        xl: '0',            // MANDATORY: Zero radius
        full: '0',          // MANDATORY: Zero radius
      },
      spacing: {
        // Semantic spacing (DESIGN.md)
        'space-2xs': '0.125rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '0.75rem',
        'space-base': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4rem',
        'gutter-mobile': '0.75rem',
        'gutter-desktop': '1.25rem',
        'sidebar-width': '17.5rem',
        'header-height': '3.25rem',
        'margin-desktop': '2.5rem',
        'margin-mobile': '1rem',
        'metadata-gap': '0.5rem',
        'gutter-sm': '1rem',
        'container-padding': '1.5rem',
        // Compatibility (existing camelCase)
        space2xs: '0.125rem',
        spacexs: '0.25rem',
        spaceSm: '0.5rem',
        spaceMd: '0.75rem',
        spaceBase: '1rem',
        spaceLg: '1.5rem',
        spaceXl: '2rem',
        space2xl: '3rem',
        space3xl: '4rem',
        gutterMobile: '0.75rem',
        gutterDesktop: '1.25rem',
        sidebarWidth: '17.5rem',
        headerHeight: '3.25rem',
        marginDesktop: '2.5rem',
        marginMobile: '1rem',
        metadataGap: '0.5rem',
        gutterSm: '1rem',
        containerPadding: '1.5rem',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        // Semantic font tokens (DESIGN.md) — used as font-xxx
        'body-lg': ['JetBrains Mono', 'monospace'],
        'body-md': ['JetBrains Mono', 'monospace'],
        'body-sm': ['JetBrains Mono', 'monospace'],
        'label-md': ['JetBrains Mono', 'monospace'],
        'label-sm': ['JetBrains Mono', 'monospace'],
        'micro-metadata': ['JetBrains Mono', 'monospace'],
        'editorial-h1': ['JetBrains Mono', 'monospace'],
        'headline-xl': ['JetBrains Mono', 'monospace'],
        'headline-lg': ['JetBrains Mono', 'monospace'],
        'headline-md': ['JetBrains Mono', 'monospace'],
        code: ['JetBrains Mono', 'monospace'],
        'code-telemetry': ['JetBrains Mono', 'monospace'],
        // Compatibility (existing camelCase)
        bodyMd: ['JetBrains Mono', 'monospace'],
        bodyLg: ['JetBrains Mono', 'monospace'],
        editorialH1: ['JetBrains Mono', 'monospace'],
        microMetadata: ['JetBrains Mono', 'monospace'],
        headlineXl: ['JetBrains Mono', 'monospace'],
        headlineLg: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Semantic typography (DESIGN.md)
        'headline-xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-xl-mobile': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.03em' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['20px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.02em' }],
        'headline-md': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['11px', { lineHeight: '16px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.08em' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.12em' }],
        'code-telemetry': ['11px', { lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '500' }],
        // Compatibility (existing camelCase)
        bodyLg: ['15px', { lineHeight: '24px', fontWeight: '400' }],
        bodyMd: ['13px', { lineHeight: '20px', fontWeight: '400' }],
        bodySm: ['11px', { lineHeight: '16px', fontWeight: '400' }],
        labelMd: ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.08em' }],
        labelSm: ['10px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.12em' }],
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        // Depth from structural borders only, no heavy shadows
        hard: '0 0 0 #060e20',  // Reduced to structural contrast only
        glow: 'inset 0 0 4px rgba(78, 222, 163, 0.15)',
        glowStrong: 'inset 0 0 8px rgba(78, 222, 163, 0.35)',
        // Emerald glow for focused elements
        emeraldGlow: '0 0 16px -2px rgba(78, 222, 163, 0.15), inset 0 0 0 1px rgba(78, 222, 163, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-border': 'glowBorder 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glowBorder: { '0%, 100%': { boxShadow: 'inset 0 0 4px rgba(16, 185, 129, 0.2)' }, '50%': { boxShadow: 'inset 0 0 8px rgba(16, 185, 129, 0.5)' } },
      },
    },
  },
  plugins: [],
}