import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, Modal, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BankAccountGrid from './bank-account-credentails-component';
import { IBankAccountCredentails } from '../entities/db-entities/bank-account-credentails';

// Dummy data for demonstration
// const bankAccounts: IBankAccountCredentails[] = [
//   {
//     AccountHolderName: 'John Doe',
//     BankName: 'Bank of America',
//     AccountType: 'Savings',
//     AccountNumber: '1234567890',
//     CustomerId: 'CUST001',
//     LoginId: 'john.doe',
//     Password: '********',
//     TransactionPassord: '********',
//     AtmPin: '****',
//     TPin: '****',
//     NetbankingUrl: 'https://bank.com',
//     CreatedOn: new Date(),
//     LastUpdatedOn: new Date(),
//   },
// ];

const appCredentials = [
  {
    ApplicationName: 'Gmail',
    UserName: 'john@gmail.com',
    Password: '********',
    LoginUrl: 'https://mail.google.com',
    AdditionalInfo: { note: 'Personal email', CVVNumber: 4578 },
  },
];


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





const Landing: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [bankData, setBankData] = React.useState<IBankAccountCredentails[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await readBankAccountDataFromStorage();
      if (Array.isArray(data) && data.length > 0) {
        setBankData(data);
      }
    };
    fetchData();
  }, []);

  const handleAddBank = (rec: IBankAccountCredentails) => {
    const updated = [...bankData, rec];
    setBankData(updated);
    writeBankAccountDataToStorage(updated);
  };
  const handleEditBank = (rec: IBankAccountCredentails, idx: number) => {
    const updated = bankData.map((item, i) => (i === idx ? rec : item));
    setBankData(updated);
    writeBankAccountDataToStorage(updated);
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#f5f5f5', overflow: 'auto' }}>
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
        <Tab label="Bank Account Credentials" />
        <Tab label="Application Credentials" />
      </Tabs>
      {tab === 0 && <BankAccountGrid onAdd={handleAddBank} onEdit={handleEditBank} bankAccounts={bankData} />}
      {/* {tab === 1 && <AppCredentialsGrid />} */}
    </Box>
  );
};

export default Landing;
