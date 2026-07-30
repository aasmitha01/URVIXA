import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('urvixa_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'yellow') return saved;
    return 'light';
  });

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('urvixa_theme', t);
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('yellow');
    else setTheme('light');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-yellow');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'yellow') {
      root.classList.add('theme-yellow');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
