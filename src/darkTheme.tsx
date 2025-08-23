import { createTheme } from '@mui/material/styles';

// Dark metallic-inspired theme: deep steel, graphite, and blue accent
const createThemeMethod: any = createTheme; 
const darkTheme = createThemeMethod({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a4a5a', // deep steel
    },
    secondary: {
      main: '#1976d2', // blue accent
    },
    background: {
      default: '#23272f', // dark metallic background
      paper: '#2c313a',
    },
    text: {
      primary: '#f5f7fa',
      secondary: '#b0b8c1',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #2c313a 60%, #23272f 100%)',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)',
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
          background: '#2c313a',
          borderRadius: 8,
        },
        columnHeaders: {
          background: '#23272f',
          color: '#b0b8c1',
        },
        cell: {
          color: '#f5f7fa',
        },
      },
    },
  },
});

export default darkTheme;
