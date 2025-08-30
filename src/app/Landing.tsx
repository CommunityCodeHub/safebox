import React from 'react';
import { Box, Tabs, Tab, IconButton, Tooltip, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from './common-components/drawer-menu-component';
import BankAccountCredentialListComponent from './bank-account-credentail-components/bank-account-credentails-list-component';
import ApplicationCredentialsListComponent from './application-credentail-components/application-credentails-list-component';
import SettingsComponent from './settings-components/settings-component';
import ChangePassword from './user-components/ChangePassword';
import NotesListComponent from './notes-components/notes-list-component';


const Landing: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["Home"]);
  const [showSettingsModalDialog, setShowSettingsModalDialog] = React.useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  
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
        onSettings={() => {
          setBreadcrumb(["Home", "Settings"]);
          setDrawerOpen(false);
          setShowSettingsModalDialog(true);
        }}
        onChangePassword={() => {
          setBreadcrumb(["Home", "Change Password"]);
          setDrawerOpen(false);
          setShowChangePasswordModal(true);
        }}
        breadcrumb={breadcrumb}
      />
      <Modal open={showSettingsModalDialog} onClose={() => setShowSettingsModalDialog(false)}>
        <SettingsComponent onClose={() => setShowSettingsModalDialog(false)} />
      </Modal>
      <Modal open={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)}>
        <ChangePassword open={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} onChangePassword={() => {}} />
      </Modal>
      
      {/* Tabs and Content */}
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
        <Tab label="Bank Account Credentials" />
        <Tab label="Application Credentials" />
        <Tab label="Notes" />
      </Tabs>
      {tab === 0 && <BankAccountCredentialListComponent />}
      {tab === 1 && <ApplicationCredentialsListComponent />}
      {tab === 2 && <NotesListComponent />}
      
    </Box>

    
  );
};


export default Landing;


