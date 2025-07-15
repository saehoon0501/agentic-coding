import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

function DarkModeToggle({ isDarkMode, onToggle }) {
  return (
    <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={onToggle}
        className={`
          ${isDarkMode 
            ? 'text-yellow-400 hover:text-yellow-300' 
            : 'text-gray-600 hover:text-gray-800'
          }
          transition-colors duration-200
        `}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}

export default DarkModeToggle;