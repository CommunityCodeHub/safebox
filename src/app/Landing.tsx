import React, { useEffect } from 'react';
import { Box, Tabs, Tab, IconButton, Tooltip, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from './common-components/drawer-menu-component';
import BankAccountCredentialListComponent from './bank-account-credentail-components/bank-account-credentails-list-component';
import { IBankAccountCredentails } from '../entities/db-entities/bank-account-credentails';
import ApplicationCredentialsListComponent from './application-credentail-components/application-credentails-list-component';
import SettingsComponent from './settings-components/settings-component';
import AddApplicationCredentialsComponent from './application-credentail-components/add-application-credentails-component';
import { useUserSettings } from './services/user-settings-context';
import { IUserSettings } from '../entities/db-entities/user-settings';

async function readBankAccountDataFromStorage(userSettings: IUserSettings): Promise<IBankAccountCredentails[]> {
  const workspacePath = userSettings.WorkspacePath;
  const encryptionKey = userSettings.EncryptionKey; 

  if (!workspacePath) return [];

  try {
    const result = await window.api.readBankAccountCredentialsFile(workspacePath, encryptionKey);
    if (result.success) {
      return result.fileContent as IBankAccountCredentails[];
    } else {
      console.error('Failed to read bank account file:', result.error);
      return [];
    }
  } catch (err) {
    console.error('Error reading bank account file:', err);
    alert('Error reading bank account file');
    return [];
  }
}

async function writeBankAccountDataToStorage(data: IBankAccountCredentails[], userSettings: IUserSettings): Promise<void> {
  
  const workspacePath = userSettings.WorkspacePath;
  const encryptionKey = userSettings.EncryptionKey; 
  if (!workspacePath) {
    console.error('Workspace path not found');
    alert('Workspace path not found');
    return;
  }

  try {
    const result = await window.api.writeBankAccountCredentialsFile(workspacePath, data, encryptionKey);
    if (result.success) {
      console.log('Bank account data written successfully');
    } else {
      console.error('Failed to write bank account data:', result.error);
    }
  } catch (err) {
    console.error('Error writing bank account file:', err);
    alert('Error writing bank account file');
  }
}

const Landing: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [bankData, setBankData] = React.useState<IBankAccountCredentails[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["Home"]);
  const userSettings = useUserSettings();
  
  useEffect(() => {
    const fetchData = async () => {
      const bankAccountData = await readBankAccountDataFromStorage(userSettings);
      if (Array.isArray(bankAccountData) && bankAccountData.length > 0) {
        setBankData(bankAccountData);
      }
      
    };
    fetchData();
  }, []);

  const handleAddBankCredentails = (rec: IBankAccountCredentails) => {
    const updated = [...bankData, rec];
    setBankData(updated);
    writeBankAccountDataToStorage(updated, userSettings);
  };
  const handleEditBankCredentails = (rec: IBankAccountCredentails, idx: number) => {
    const updated = bankData.map((item, i) => (i === idx ? rec : item));
    setBankData(updated);
    writeBankAccountDataToStorage(updated, userSettings);
  };

  const [showSettingsModalDialog, setShowSettingsModalDialog] = React.useState(false);

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
        breadcrumb={breadcrumb}
      />
      <Modal open={showSettingsModalDialog} onClose={() => setShowSettingsModalDialog(false)}>
        <SettingsComponent onClose={() => setShowSettingsModalDialog(false)} />
      </Modal>
      
      {/* Tabs and Content */}
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
        <Tab label="Bank Account Credentials" />
        <Tab label="Application Credentials" />
      </Tabs>
      {tab === 0 && <BankAccountCredentialListComponent />}
      {tab === 1 && <ApplicationCredentialsListComponent />}
    </Box>

    
  );
};


export default Landing;


