import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Breadcrumbs, Typography, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import NotesIcon from '@mui/icons-material/Notes';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AppsIcon from '@mui/icons-material/Apps';
import { useNavigate } from 'react-router-dom';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  breadcrumb: string[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose, onLogout, breadcrumb }) => {
  const navigate = useNavigate();
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
            <ListItemButton onClick={() => { navigate('/app/dashboard'); onClose(); }}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/app/application-credentials'); onClose(); }}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary="Application Details" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/app/bank-account-credentials'); onClose(); }}>
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Bank Account Details" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/app/notes'); onClose(); }}>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="Notes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/app/help'); onClose(); }}>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
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
