import React from 'react';
import { LightMode, DarkMode } from '@mui/icons-material';

function DarkModeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 right-4 p-3 rounded-full 
        transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }
        hover:scale-110 active:scale-95
        shadow-lg hover:shadow-xl
        border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}
      `}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? <LightMode /> : <DarkMode />}
    </button>
  );
}

export default DarkModeToggle;