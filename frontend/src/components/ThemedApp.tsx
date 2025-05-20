/**
 * ThemedApp.tsx
 * Root application component that provides theme context and routing.
 * Implements a cyberpunk-inspired theme system with light and dark modes.
 */

import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import App from '../App';

/**
 * ThemedApp Component
 * Configures and provides Material-UI theming for the entire application.
 * Features:
 * - Dynamic theme switching between light and dark modes
 * - Cyberpunk-inspired color palette
 * - CSS variables integration
 * - Global style normalization
 * - Router configuration
 * 
 * Theme Structure:
 * 1. Light Mode:
 *    - Clean, professional look with green accents
 *    - High contrast for readability
 *    - Neutral backgrounds for content focus
 * 
 * 2. Dark Mode (Cyberpunk):
 *    - Neon red accents for cyberpunk aesthetic
 *    - Deep, rich backgrounds
 *    - Carefully balanced contrast for eye comfort
 * 
 * @returns {JSX.Element} The themed application root
 */
export function ThemedApp() {
  const { isLightMode } = useTheme();

  /**
   * Memoized theme configuration
   * Creates a Material-UI theme object based on the current mode.
   * Maps CSS variables to Material-UI's theme structure.
   */
  const muiTheme = useMemo(() => {
    // Define palette based on CSS variables
    const palette: PaletteOptions = isLightMode
      ? { // Light Mode Palette
          mode: 'light',
          primary: { main: '#36ff74' },    // --accent-primary: Professional green
          secondary: { main: '#6affb0' },   // --accent-secondary: Softer green
          background: {
            default: '#ffffff',             // --bg-primary: Clean white
            paper: '#f6f8fb',              // --bg-secondary: Subtle blue-grey
          },
          text: {
            primary: '#101820',            // --text-primary: Near black
            secondary: '#505868',          // --text-secondary: Muted blue-grey
          },
        }
      : { // Dark Mode Palette (Cyberpunk)
          mode: 'dark',
          primary: { main: '#ff3a4c' },    // --accent-primary: Neon red
          secondary: { main: '#ff7080' },   // --accent-secondary: Soft neon pink
          background: {
            default: '#0a0a0f',            // --bg-primary: Deep space black
            paper: '#141420',              // --bg-secondary: Rich dark blue
          },
          text: {
            primary: '#e0e0e0',            // --text-primary: Soft white
            secondary: '#9b9ba7',          // --text-secondary: Muted lavender
          },
        };

    return createTheme({ palette });
  }, [isLightMode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />  {/* Normalize styles across browsers */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  );
} 