import {StyledEngineProvider} from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeContextProvider from './ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <ThemeContextProvider>
        <CssBaseline />
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <App />
      </ThemeContextProvider>
    </StyledEngineProvider>
  </React.StrictMode>
); 