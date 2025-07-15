import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import TimeboxTimer from './timeboxTimer';
import DarkModeToggle from './DarkModeToggle';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply the theme class to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div className={`
        min-h-screen flex items-center justify-center transition-colors duration-200
        ${isDarkMode 
          ? 'bg-gray-900' 
          : 'bg-gray-50'
        }
      `}>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        <TimeboxTimer isDarkMode={isDarkMode} />
      </div>
    </ThemeProvider>
  );
}

export default App; 