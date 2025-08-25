import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Breadcrumbs, Typography, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSettings: () => void;
  breadcrumb: string[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose, onLogout, onSettings, breadcrumb }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250, p: 2 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumb.map((crumb, idx) => (
            <Typography color={idx === breadcrumb.length - 1 ? 'text.primary' : 'inherit'} key={crumb} fontWeight={idx === breadcrumb.length - 1 ? 600 : 400}>
              {crumb}
            </Typography>
          ))}
        </Breadcrumbs>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onSettings}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
