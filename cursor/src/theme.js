import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#111827' : '#3b82f6',
    },
    secondary: {
      main: mode === 'light' ? '#6b7280' : '#9ca3af',
    },
    background: {
      default: mode === 'light' ? '#fafbfc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#111827' : '#f1f5f9',
      secondary: mode === 'light' ? '#6b7280' : '#94a3b8',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});