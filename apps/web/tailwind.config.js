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
        // Surface System (from DESIGN.md)
        void: '#060d20',
        surface: '#0b1326',
        surfaceLow: '#111827',
        surfaceContainer: '#171f33',
        structuralBorder: '#222a3e',
        
        // Luminescent Primaries & Accents
        intelligentEmerald: '#4edea3',
        deepEmerald: '#10b981',
        cyanRelay: '#06b6d4',
        sapphireVector: '#3b82f6',
        amethystNeural: '#a855f7',
        
        // Content & Readout
        primaryText: '#dbe2fd',
        lightEmeraldText: '#d8f3dc',
        mutedText: '#94a3b8',
        matrixMetadata: '#bbcabf',
        
        // Keep some existing colors for compatibility
        background: '#0b1326',
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
        outline: '#86948a',
        outlineVariant: '#3c4a42',
        borderSubtle: '#334155',
      },
      borderRadius: {
        DEFAULT: '0',       // MANDATORY: Zero radius
        lg: '0',            // MANDATORY: Zero radius
        xl: '0',            // MANDATORY: Zero radius
        full: '0',          // MANDATORY: Zero radius
      },
      spacing: {
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
        bodyMd: ['JetBrains Mono', 'monospace'],
        bodyLg: ['JetBrains Mono', 'monospace'],
        editorialH1: ['JetBrains Mono', 'monospace'],
        microMetadata: ['JetBrains Mono', 'monospace'],
        headlineXl: ['JetBrains Mono', 'monospace'],
        headlineLg: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'headline-xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-xl-mobile': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.03em' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['20px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.02em' }],
        'headline-md': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }],
        bodyLg: ['15px', { lineHeight: '24px', fontWeight: '400' }],
        bodyMd: ['13px', { lineHeight: '20px', fontWeight: '400' }],
        bodySm: ['11px', { lineHeight: '16px', fontWeight: '400' }],
        labelMd: ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.08em' }],
        labelSm: ['10px', { lineHeight: '14px', fontWeight: '600', letterSpacing: '0.12em' }],
        'code-telemetry': ['JetBrains Mono', { fontSize: '11px', lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '500' }],
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
        'glow-border': 'glowBorder 2s ease-in-out infinite',  // Fixed: quoted key
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