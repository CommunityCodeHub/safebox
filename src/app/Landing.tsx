import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Dummy data for demonstration
const bankAccounts = [
  {
    AccountHolderName: 'John Doe',
    BankName: 'Bank of America',
    AccountType: 'Savings',
    AccountNumber: '1234567890',
    CustomerId: 'CUST001',
    LoginId: 'john.doe',
    Password: '********',
    TransactionPassord: '********',
    AtmPin: '****',
    TPin: '****',
    NetbankingUrl: 'https://bank.com',
    CreatedOn: new Date().toLocaleDateString(),
    LastUpdatedOn: new Date().toLocaleDateString(),
  },
];

const appCredentials = [
  {
    ApplicationName: 'Gmail',
    UserName: 'john@gmail.com',
    Password: '********',
    LoginUrl: 'https://mail.google.com',
    AdditionalInfo: { note: 'Personal email', CVVNumber: 4578 },
  },
];

const bankAccountColumns: GridColDef[] = [
  { field: 'AccountHolderName', headerName: 'Account Holder', flex: 1 },
  { field: 'BankName', headerName: 'Bank', flex: 1 },
  { field: 'AccountType', headerName: 'Type', flex: 1 },
  { field: 'AccountNumber', headerName: 'Account #', flex: 1 },
  { field: 'CustomerId', headerName: 'Customer ID', flex: 1 },
  { field: 'LoginId', headerName: 'Login ID', flex: 1 },
  { field: 'NetbankingUrl', headerName: 'Netbanking URL', flex: 1 },
  { field: 'CreatedOn', headerName: 'Created', flex: 1 },
  { field: 'LastUpdatedOn', headerName: 'Updated', flex: 1 },
];

const BankAccountGrid: React.FC = () => (
  <Box p={2} sx={{ height: 400, width: '100%' }}>
    <Typography variant="h6" gutterBottom>Bank Account Credentials</Typography>
    <DataGrid
      rows={bankAccounts.map((row, i) => ({ id: i, ...row }))}
      columns={bankAccountColumns}
      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
      pageSizeOptions={[5, 10, 20]}
      autoHeight={false}
    />
  </Box>
);

const appCredentialsColumns: GridColDef[] = [
  { field: 'ApplicationName', headerName: 'Application Name', flex: 1 },
  { field: 'UserName', headerName: 'User Name', flex: 1 },
  { field: 'Password', headerName: 'Password', flex: 1 },
  { field: 'LoginUrl', headerName: 'Login URL', flex: 1 },
  { field: 'AdditionalInfo', headerName: 'Additional Info', flex: 1, valueGetter: (params: any) => {
    if (typeof params === 'string') return params;
      if (params && typeof params === 'object') {
        return Object.entries(params).map(([k, v]) => `${k}: ${v}`).join(', \n');
      }
      return '';
    }
  },
];

const AppCredentialsGrid: React.FC = () => (
  <Box p={2} sx={{ height: 400, width: '100%' }}>
    <Typography variant="h6" gutterBottom>Application Credentials</Typography>
    <DataGrid
      rows={appCredentials.map((row, i) => ({ id: i, ...row }))}
      columns={appCredentialsColumns}
      initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
      pageSizeOptions={[5, 10, 20]}
      autoHeight={false}
    />
  </Box>
);

const Landing: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#f5f5f5', overflow: 'auto' }}>
      <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
        <Tab label="Bank Account Credentials" />
        <Tab label="Application Credentials" />
      </Tabs>
      {tab === 0 && <BankAccountGrid />}
      {tab === 1 && <AppCredentialsGrid />}
    </Box>
  );
};

export default Landing;
