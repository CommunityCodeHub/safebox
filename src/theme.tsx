import { createTheme } from '@mui/material/styles';

// Metallic-inspired theme: steel blue, silver, and soft gray
const createThemeMethod:any = createTheme; 
const theme = createThemeMethod({
  palette: {
    mode: 'light',
    primary: {
      main: '#5a6d7c', // steel blue
    },
    secondary: {
      main: '#b0b8bc', // silver/gray accent
    },
    background: {
      default: '#e6e8ea', // light metallic background
      paper: '#f4f6f8',
    },
    text: {
      primary: '#23272f',
      secondary: '#5a6d7c',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #f4f6f8 60%, #d1d5db 100%)',
          boxShadow: '0 2px 12px 0 rgba(90,109,124,0.10)',
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
    MuiDataGrid: {
      styleOverrides: {
        root: {
          background: '#f4f6f8',
          borderRadius: 8,
        },
        columnHeaders: {
          background: '#e6e8ea',
          color: '#5a6d7c',
        },
        cell: {
          color: '#23272f',
        },
      },
    },
  },
});

export default theme;
