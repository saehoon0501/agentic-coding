import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import DarkModeToggle from './DarkModeToggle';
import TimeboxTimer from './timeboxTimer';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = createAppTheme(isDarkMode ? 'dark' : 'light');

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedMode ? savedMode === 'true' : prefersDark;
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        {/* Header with dark mode toggle */}
        <header className="flex justify-end p-4">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={handleToggleDarkMode} />
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <TimeboxTimer isDarkMode={isDarkMode} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 