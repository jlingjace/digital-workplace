import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logistics Modernism — primary orange
        "primary": "#a63c00",
        "on-primary": "#ffffff",
        "primary-container": "#ff6000",
        "on-primary-container": "#531a00",
        "inverse-primary": "#ffb598",
        "primary-fixed": "#ffdbce",
        "primary-fixed-dim": "#ffb598",
        "on-primary-fixed": "#370e00",
        "on-primary-fixed-variant": "#7e2c00",
        "surface-tint": "#a63c00",
        // Secondary
        "secondary": "#575e70",
        "on-secondary": "#ffffff",
        "secondary-container": "#d9dff5",
        "on-secondary-container": "#5c6274",
        "secondary-fixed": "#dce2f7",
        "secondary-fixed-dim": "#c0c6db",
        "on-secondary-fixed": "#141b2b",
        "on-secondary-fixed-variant": "#404758",
        // Tertiary
        "tertiary": "#0059c5",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#5791ff",
        "on-tertiary-container": "#002a64",
        "tertiary-fixed": "#d8e2ff",
        "tertiary-fixed-dim": "#aec6ff",
        "on-tertiary-fixed": "#001a43",
        "on-tertiary-fixed-variant": "#004397",
        // Background / Surface
        "background": "#f9f9ff",
        "on-background": "#151c27",
        "surface": "#f9f9ff",
        "on-surface": "#151c27",
        "surface-variant": "#dce2f3",
        "on-surface-variant": "#5b4137",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#d3daea",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eefe",
        "surface-container-high": "#e2e8f8",
        "surface-container-highest": "#dce2f3",
        "inverse-surface": "#2a313d",
        "inverse-on-surface": "#ebf1ff",
        // Outline
        "outline": "#8f7065",
        "outline-variant": "#e3bfb1",
        // States
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // Utility
        "success-green": "#10B981",
        // Legacy badge colors (kept for dept badges)
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '900' }],
        'headline': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'title-lg': ['1.375rem', { lineHeight: '1.3', fontWeight: '700' }],
        'label-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '40px',
        'xl': '64px',
        'sidebar': '280px',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      maxWidth: {
        'content': '1440px',
      },
      boxShadow: {
        card:         '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
}
export default config
