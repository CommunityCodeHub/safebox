import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Tooltip, Divider, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotesIcon from '@mui/icons-material/Notes';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Home', icon: <HomeIcon color="primary" />, path: '/app/dashboard' },
  { label: 'Application Details', icon: <AppsIcon color="primary" />, path: '/app/application-credentials' },
  { label: 'Bank Account Details', icon: <AccountBalanceIcon color="primary" />, path: '/app/bank-account-credentials' },
  { label: 'Notes', icon: <NotesIcon color="primary" />, path: '/app/notes' },
  { label: 'Help', icon: <HelpOutlineIcon color="primary" />, path: '/app/help' },
];

const SidebarMenu: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 1200,
        bgcolor: '#f7f9fb',
        borderRight: '1.5px solid #e0e0e0',
        width: expanded ? 220 : 64,
        transition: 'width 0.2s cubic-bezier(.4,2,.6,1)',
        boxShadow: expanded ? '2px 0 12px 0 rgba(59,125,221,0.04)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        pt: 2,
      }}
    >
      <Box display="flex" alignItems="center" width="100%" px={2} mb={2}>
        <Avatar src="/assets/images/safebox.png" alt="SafeBox Logo" sx={{ width: 40, height: 40, boxShadow: 1, mr: 1.5 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          color="primary.main"
          letterSpacing={1}
          sx={{
            opacity: expanded ? 1 : 0,
            width: expanded ? 'auto' : 0,
            transition: 'opacity 0.2s, width 0.2s',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          SafeBox
        </Typography>
      </Box>
      <Divider sx={{ width: '100%', mb: 1 }} />
      <List sx={{ width: '100%' }}>
        {menuItems.map(item => (
          <ListItem key={item.label} disablePadding sx={{ borderRadius: 2, mb: 0.5, width: '100%' }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                px: 2,
                justifyContent: 'flex-start',
                '&:hover': { bgcolor: '#e3f2fd' },
                width: '100%',
                transition: 'background 0.2s',
              }}
            >
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', cursor: 'pointer' }}>
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500 }}
                sx={{
                  opacity: expanded ? 1 : 0,
                  width: expanded ? 'auto' : 0,
                  transition: 'opacity 0.2s, width 0.2s',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding sx={{ borderRadius: 2, width: '100%' }}>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              px: 2,
              justifyContent: 'flex-start',
              '&:hover': { bgcolor: '#ffe0e0' },
              width: '100%',
              transition: 'background 0.2s',
            }}
          >
            <Tooltip title="Logout" placement="right" arrow>
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', cursor: 'pointer' }}>
                <LogoutIcon color="error" />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }}
              sx={{
                opacity: expanded ? 1 : 0,
                width: expanded ? 'auto' : 0,
                transition: 'opacity 0.2s, width 0.2s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarMenu;
