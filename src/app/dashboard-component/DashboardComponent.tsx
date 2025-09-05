import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DashboardComponent: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to SafeBox!
        </Typography>
        <Typography variant="body1" align="center">
          This is your secure credential management dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardComponent;
