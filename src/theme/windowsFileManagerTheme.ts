import { createTheme } from '@mui/material/styles';

// Windows File Manager inspired palette
const windowsFileManagerTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b7ddd', // blue accent
      contrastText: '#fff',
    },
    secondary: {
      main: '#f3f6fa', // soft background
      contrastText: '#3b7ddd',
    },
    background: {
      default: '#f7f9fb',
      paper: '#fff',
    },
    text: {
      primary: '#222b45',
      secondary: '#6b7a90',
    },
    divider: '#e9eef6',
    error: {
      main: '#e57373',
    },
    warning: {
      main: '#ffb300',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#43a047',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 2px 12px 0 rgba(59,125,221,0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(59,125,221,0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgba(59,125,221,0.10)',
        },
      },
    },
  },
});

export default windowsFileManagerTheme;
