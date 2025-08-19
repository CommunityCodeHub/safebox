import React, { useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import BankAccountCredentialsComponent from './bank-account-credentails-component';
import { IBankAccountCredentails } from '../entities/db-entities/bank-account-credentails';
import ApplicationCredentialsListComponent from './application-credentail-components/application-credentails-list-component';
import { IApplicationCredentials } from '../entities/db-entities/application-credentails';

async function readBankAccountDataFromStorage(): Promise<IBankAccountCredentails[]> {
  const username = sessionStorage.getItem('UserName');
  const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();
  if (!workspacePath) return [];

  try {
    const result = await window.api.readBankAccountFile(workspacePath);
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

// async function readApplicationCredentialsFromStorage(): Promise<IApplicationCredentials[]> {
//   const username = sessionStorage.getItem('UserName');
//   const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();
//   if (!workspacePath) return [];

//   try {
//     const result = await window.api.readApplicationCredentialsFile(workspacePath);
//     if (result.success) {
//       return result.fileContent as IApplicationCredentials[];
//     } else {
//       console.error('Failed to read application credentials file:', result.error);
//       return [];
//     }
//   } catch (err) {
//     console.error('Error reading application credentials file:', err);
//     alert('Error reading application credentials file');
//     return [];
//   }
// }

async function writeBankAccountDataToStorage(data: IBankAccountCredentails[]): Promise<void> {
  const username = sessionStorage.getItem('UserName');
  const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();

  if (!workspacePath) {
    console.error('Workspace path not found');
    alert('Workspace path not found');
    return;
  }

  try {
    const result = await window.api.writeBankAccountFile(workspacePath, data);
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

// async function writeApplicationCredentialsToStorage(data: IApplicationCredentials[]): Promise<void> {
//   const username = sessionStorage.getItem('UserName');
//   const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();

//   if (!workspacePath) {
//     console.error('Workspace path not found');
//     alert('Workspace path not found');
//     return;
//   }

//   try {
//     const result = await window.api.writeApplicationCredentialsFile(workspacePath, data);
//     if (result.success) {
//       console.log('Application credentials data written successfully');
//     } else {
//       console.error('Failed to write application credentials data:', result.error);
//     }
//   } catch (err) {
//     console.error('Error writing application credentials file:', err);
//     alert('Error writing application credentials file');
//   }
// }

const Landing: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [bankData, setBankData] = React.useState<IBankAccountCredentails[]>([]);
  //const [appCredentials, setAppCredentials] = React.useState<IApplicationCredentials[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const bankAccountData = await readBankAccountDataFromStorage();
      if (Array.isArray(bankAccountData) && bankAccountData.length > 0) {
        setBankData(bankAccountData);
      }
      // const appCredentialsData = await readApplicationCredentialsFromStorage();
      // if (Array.isArray(appCredentialsData) && appCredentialsData.length > 0) {
      //   setAppCredentials(appCredentialsData);
      // }
    };
    fetchData();
  }, []);

  const handleAddBankCredentails = (rec: IBankAccountCredentails) => {
    const updated = [...bankData, rec];
    setBankData(updated);
    writeBankAccountDataToStorage(updated);
  };
  const handleEditBankCredentails = (rec: IBankAccountCredentails, idx: number) => {
    const updated = bankData.map((item, i) => (i === idx ? rec : item));
    setBankData(updated);
    writeBankAccountDataToStorage(updated);
  };

  // const handleAddAppCredentials = (rec: IApplicationCredentials) => {
  //   const updated = [...appCredentials, rec];
  //   setAppCredentials(updated);
  //   writeApplicationCredentialsToStorage(updated);
  // };

  // const handleEditAppCredentials = (rec: IApplicationCredentials, idx: number) => {
  //   const updated = appCredentials.map((item, i) => (i === idx ? rec : item));
  //   setAppCredentials(updated);
  //   writeApplicationCredentialsToStorage(updated);
  // };

  return (
    <Box sx={{ width: '99vw', height: '99vh', bgcolor: '#f5f5f5', overflow: 'auto' }}>
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
        <Tab label="Bank Account Credentials" />
        <Tab label="Application Credentials" />
      </Tabs>
      {tab === 0 && <BankAccountCredentialsComponent onAdd={handleAddBankCredentails} onEdit={handleEditBankCredentails} bankAccounts={bankData} />}
      {tab === 1 && <ApplicationCredentialsListComponent />}
    </Box>
  );
};


export default Landing;


