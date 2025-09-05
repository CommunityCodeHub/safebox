import React from 'react';
import { Box } from '@mui/material';
import SidebarMenu from './common-components/sidebar-menu-component';
import { Outlet } from 'react-router-dom';


const Landing: React.FC = () => {
  const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["Home"]);
    

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', bgcolor: '#f5f5f5', overflow: 'hidden', position: 'relative' }}>
      <SidebarMenu
        onLogout={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      />
      <Box sx={{ flex: 1, height: '100vh', pt: 0, mt: 3, overflow: 'auto', ml: { xs: '32px', sm: '32px', md: '110px', lg: '110px' } }}>
        <Outlet />
      </Box>
    </Box>
  );
};


export default Landing;


