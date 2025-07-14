import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import TimeboxTimer from './timeboxTimer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className="bg-gray-100 dark:bg-gray-800"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          aria-label="toggle dark mode"
          onClick={toggleDarkMode}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
        <TimeboxTimer />
      </div>
    </ThemeProvider>
  );
}

export default App; 
