/**
 * Centralized brand color config, shared between the website (Tailwind's
 * blue-600 palette) and email templates, which can't consume Tailwind classes
 * directly and need raw hex values.
 */
export const COLORS = {
  primary: {
    hex: {
      light: "#60a5fa", // blue-400
      main: "#2563eb", // blue-600
      dark: "#1e40af", // blue-800
    },
  },
  secondary: {
    hex: {
      light: "#fbbf24", // amber-400
      main: "#f59e0b", // amber-500
      dark: "#b45309", // amber-700
    },
  },
};
