// KBYG.ai Brand Colors - Tailwind Config Extension

module.exports = {
  theme: {
    extend: {
      colors: {
        kbyg: {
          blue: {
            DEFAULT: '#3b82f6',
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Brand primary
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          purple: {
            DEFAULT: '#8b5cf6',
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#8b5cf6', // Brand secondary
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4', // Brand accent
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
        },
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-full': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-command': 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)',
      },
    },
  },
}
