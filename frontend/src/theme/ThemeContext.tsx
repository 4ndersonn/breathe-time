import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('breathe_time_theme_mode');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('breathe_time_theme_mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2563eb' : '#3b82f6',
            light: '#60a5fa',
            dark: '#1d4ed8',
          },
          secondary: {
            main: mode === 'light' ? '#fc8200' : '#0d0501',
          },
          background: {
            default: mode === 'light' ? '#e6f1ff' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
          text: {
            primary: mode === 'light' ? '#0d121b' : '#f8fafc',
            secondary: mode === 'light' ? '#0c1119' : '#94a3b8',
          },
        },
        typography: {
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.25rem',
          },
          h2: {
            fontWeight: 600,
            fontSize: '1.75rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
