import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Breadcrumbs, Typography, Box, Divider, Avatar } from '@mui/material';
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
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#f7f9fb', borderRight: '1.5px solid #e0e0e0' } }}>
      <Box sx={{ width: 270, p: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" py={3} sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f7f9fb 100%)' }}>
          <Avatar src="/assets/images/safebox.png" alt="SafeBox Logo" sx={{ width: 56, height: 56, mb: 1, boxShadow: 1 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main" letterSpacing={1} sx={{ mb: 0.5 }}>
            SafeBox
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, px: 2 }}>
          {breadcrumb.map((crumb, idx) => (
            <Typography color={idx === breadcrumb.length - 1 ? 'text.primary' : 'inherit'} key={crumb} fontWeight={idx === breadcrumb.length - 1 ? 600 : 400} fontSize={13}>
              {crumb}
            </Typography>
          ))}
        </Breadcrumbs>
        <List sx={{ px: 1 }}>
          <ListItem disablePadding sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemButton onClick={() => { navigate('/app/dashboard'); onClose(); }} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemButton onClick={() => { navigate('/app/application-credentials'); onClose(); }} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>
              <ListItemIcon>
                <AppsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Application Details" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemButton onClick={() => { navigate('/app/bank-account-credentials'); onClose(); }} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>
              <ListItemIcon>
                <AccountBalanceIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Bank Account Details" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemButton onClick={() => { navigate('/app/notes'); onClose(); }} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>
              <ListItemIcon>
                <NotesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Notes" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemButton onClick={() => { navigate('/app/help'); onClose(); }} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>
              <ListItemIcon>
                <HelpOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Help" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding sx={{ borderRadius: 2 }}>
            <ListItemButton onClick={onLogout} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#ffe0e0' } }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
