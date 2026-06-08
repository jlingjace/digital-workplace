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
        // Logistics Modernism — Primary
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
        // Surface & Background
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
        // Error
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // Functional
        "success-green": "#10B981",
        "warning-amber": "#F59E0B",
        "error-red": "#EF4444",
        "surface-gray": "#F9FAFB",
        "border-subtle": "#E5E7EB",
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
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        base: '4px',
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '40px',
        xl: '64px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
        'sidebar': '280px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Hanken Grotesk', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
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
