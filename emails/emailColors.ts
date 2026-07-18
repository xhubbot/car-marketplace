/**
 * Email Color Constants
 * Imports from centralized COLORS config to ensure consistency
 * between website and email templates
 */

import { COLORS } from "@/config/colors";

export const EMAIL_COLORS = {
  // Primary brand color (blue)
  primary: COLORS.primary.hex.main,
  primaryLight: COLORS.primary.hex.light,
  primaryDark: COLORS.primary.hex.dark,

  // Secondary color (amber)
  secondary: COLORS.secondary.hex.main,
  secondaryLight: COLORS.secondary.hex.light,
  secondaryDark: COLORS.secondary.hex.dark,

  // Common colors
  white: "#ffffff",
  black: "#000000",
  lightGray: "#f5f5f5",
  gray: "#666666",
  darkGray: "#333333",
  textSecondary: "#666666",

  // Status colors
  success: "#27ae60",
  error: "#e74c3c",
  warning: "#f39c12",
  info: COLORS.primary.hex.main,
};
