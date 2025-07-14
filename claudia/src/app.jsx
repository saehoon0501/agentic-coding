import React from 'react';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import TimeboxTimer from './timeboxTimer';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from './ThemeContext';

function App() {
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div 
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}
      style={{ 
        backgroundColor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary 
      }}
    >
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      <TimeboxTimer />
    </div>
  );
}

export default App; 