import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextValue {
  isLightMode: boolean;
  toggleTheme: () => void;
  accentPrimary: string;
  accentSecondary: string;
}

// Provide sensible cyberpunk defaults until real values are read from CSS variables
const DEFAULT_ACCENT_PRIMARY = '#ff3a4c';
const DEFAULT_ACCENT_SECONDARY = '#ff7080';

const ThemeContext = createContext<ThemeContextValue>({
  isLightMode: false,
  toggleTheme: () => {},
  accentPrimary: DEFAULT_ACCENT_PRIMARY,
  accentSecondary: DEFAULT_ACCENT_SECONDARY,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLightMode, setIsLightMode] = useState<boolean>(() => localStorage.getItem('taskflow-cyberpunk-theme') === 'light');

  const [accents, setAccents] = useState({
    accentPrimary: DEFAULT_ACCENT_PRIMARY,
    accentSecondary: DEFAULT_ACCENT_SECONDARY,
  });

  // Sync body class and localStorage when theme toggles
  useEffect(() => {
    if (isLightMode) document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');

    localStorage.setItem('taskflow-cyberpunk-theme', isLightMode ? 'light' : 'dark');

    // After DOM styles update, read CSS variables for accent colors so React components stay in sync
    const rootStyles = getComputedStyle(document.documentElement);
    const accentPrimary = rootStyles.getPropertyValue('--accent-primary').trim() || DEFAULT_ACCENT_PRIMARY;
    const accentSecondary = rootStyles.getPropertyValue('--accent-secondary').trim() || DEFAULT_ACCENT_SECONDARY;
    setAccents({ accentPrimary, accentSecondary });
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme, ...accents }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}