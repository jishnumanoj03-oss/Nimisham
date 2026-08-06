/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nim: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-secondary)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
          text: 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
          border: 'var(--border)',
          'border-focus': 'var(--border-focus)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          'accent-muted': 'var(--accent-muted)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'label': ['0.6875rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.05em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'small': ['0.8125rem', { lineHeight: '1.5' }],
        'body': ['0.9375rem', { lineHeight: '1.6' }],
        'h4': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h3': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        'xs': '4px',
        'sm-space': '8px',
        'md-space': '12px',
      },
      borderRadius: {
        'nim-sm': '4px',
        'nim-md': '8px',
        'nim-lg': '12px',
        'nim-xl': '16px',
      },
      boxShadow: {
        'nim-sm': '0 1px 2px rgba(0,0,0,0.3)',
        'nim-md': '0 4px 12px rgba(0,0,0,0.25)',
        'nim-lg': '0 8px 24px rgba(0,0,0,0.3)',
        'nim-xl': '0 16px 48px rgba(0,0,0,0.35)',
        'nim-glow': '0 0 20px rgba(212,168,83,0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
  ],
}
