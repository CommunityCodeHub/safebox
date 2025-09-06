import React from 'react';
import { Box, Typography, Paper, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { APP_VERSION } from '../app-version';

const DashboardComponent: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh" bgcolor="#f5f7fa">
      <Paper elevation={6} sx={{ p: 5, maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 6 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar src={"/assets/images/safebox.ico"} alt={"SafeBox Logo"} sx={{ width: 90, height: 90, mb: 2, boxShadow: 2 }} />
          <Typography variant="h3" align="center" fontWeight={700} color="primary.main" gutterBottom>
            SafeBox
          </Typography>
          <Chip label={`Version ${APP_VERSION}`} color="secondary" size="medium" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }} />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Welcome!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          SafeBox is your secure, modern, and user-friendly credential manager. Store, organize, and access your sensitive information with confidence. Your data is encrypted and stays private—only you have the key.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight={500} gutterBottom>
          Supported Features
        </Typography>
        <List dense>
        <ListItem>
            <ListItemIcon><NewReleasesIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Save your application credentials securely." />
          </ListItem>
          <ListItem>
            <ListItemIcon><NewReleasesIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Save your Bank Account credentials, Credit Card, Debit Card information securely." />
          </ListItem>
          <ListItem>
            <ListItemIcon><NewReleasesIcon color="primary" /></ListItemIcon>
            <ListItemText primary="OneNote-style Notes: Organize your secure notes with rich text and multi-page navigation." />
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <VerifiedUserIcon color="success" />
          <Typography variant="body2" color="text.secondary">
            Your data is encrypted and stored securely. Only you can access your data.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardComponent;
