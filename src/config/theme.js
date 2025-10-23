// Theme Configuration for Data Tools
// All tools should use these colors and design tokens for consistency

export const theme = {
  // Color Palette - Modern and vibrant
  colors: {
    primary: '#6366f1',      // Indigo - Main brand color
    primaryDark: '#4f46e5',  // Darker indigo for hover states
    primaryLight: '#818cf8', // Lighter indigo for backgrounds

    secondary: '#8b5cf6',    // Purple - Secondary actions
    secondaryDark: '#7c3aed',
    secondaryLight: '#a78bfa',

    accent: '#ec4899',       // Pink - Accent color
    accentDark: '#db2777',
    accentLight: '#f472b6',

    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    info: '#3b82f6',         // Blue

    // Neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Backgrounds
    background: '#ffffff',
    backgroundDark: '#0f172a',
    surface: '#f8fafc',
    surfaceDark: '#1e293b',

    // Text
    text: '#1f2937',
    textSecondary: '#6b7280',
    textLight: '#9ca3af',
    textDark: '#111827',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (in rem units)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
};

export default theme;
