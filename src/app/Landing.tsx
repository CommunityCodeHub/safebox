import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from './common-components/drawer-menu-component';
import { Outlet } from 'react-router-dom';


const Landing: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["Home"]);
    

  return (
    <Box sx={{ width: '99vw', height: '99vh', bgcolor: '#f5f5f5', overflow: 'auto', position: 'relative' }}>
      {/* Drawer Menu Button */}
      <Tooltip title="Menu">
        <IconButton
          color="primary"
          sx={{ position: 'absolute', top: 8, left: 16, zIndex: 20 }}
          onClick={() => setDrawerOpen(true)}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      {/* Drawer Menu */}
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
        breadcrumb={breadcrumb}
      />
      <Box sx={{ mt: 6 }}>
        <Outlet />
      </Box>
    </Box>
  );
};


export default Landing;


