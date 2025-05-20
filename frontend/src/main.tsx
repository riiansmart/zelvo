/**
 * main.tsx
 * Entry point of the TaskFlow application.
 * This file sets up the React application with all necessary providers and global styles.
 * 
 * Key Features:
 * - React 18 concurrent rendering setup
 * - Global style and theme management
 * - Authentication state management
 * - Date/time picker component styling
 * - Custom cyberpunk theme integration
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import required styles for the datetime picker component
// These styles are essential for the proper rendering of date/time selection UI
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

// Import custom application styles
// cyberpunk.css: Custom theme with neon accents and dark mode aesthetics
// index.css: Global application styles and utility classes
import './styles/cyberpunk.css';
import './styles/index.css';

// Import custom context providers
// ThemeProvider: Manages application-wide theme state (light/dark mode, colors)
// AuthProvider: Handles user authentication state and token management
// ThemedApp: Root component that applies current theme to the application
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthProvider';
import { ThemedApp } from './components/ThemedApp';

// Get the root DOM element where React will mount the application
// Throws an error if the element is not found to fail fast
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Initialize React's concurrent rendering container
// Uses createRoot for React 18's concurrent features
const root = createRoot(rootElement);

/**
 * Render the application with its provider hierarchy:
 * 1. StrictMode - Enables additional development checks and warnings
 * 2. CustomThemeProvider - Provides theme context for consistent styling
 * 3. AuthProvider - Manages authentication state and user session
 * 4. ThemedApp - Main application component with theme-aware rendering
 * 
 * Provider Order:
 * - StrictMode wraps everything to catch potential issues
 * - Theme provider is outermost to ensure theme context is always available
 * - Auth provider is nested to potentially use theme context
 * - ThemedApp consumes both theme and auth context
 */
root.render(
  <StrictMode>
    <CustomThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </CustomThemeProvider>
  </StrictMode>
);