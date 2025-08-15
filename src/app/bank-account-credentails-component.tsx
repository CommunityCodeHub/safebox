import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, Modal, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BankAccountCredentails, IBankAccountCredentails } from '../entities/db-entities/bank-account-credentails';

interface BankAccountGridProps {
  onAdd: (rec: IBankAccountCredentails) => void;
  bankAccounts: IBankAccountCredentails[];
}

interface BankAccountGridProps {
  onAdd: (rec: IBankAccountCredentails) => void;
  onEdit: (rec: IBankAccountCredentails, idx: number) => void;
  bankAccounts: IBankAccountCredentails[];
}

const defaultBankAccount: IBankAccountCredentails = {
    AccountHolderName: '',
    BankName: '',
    AccountType: '',
    AccountNumber: '',
    CustomerId: '',
    LoginId: '',
    Password: '',
    TransactionPassord: '',
    AtmPin: '',
    TPin: '',
    NetbankingUrl: '',
    CreatedOn: new Date(),
    LastUpdatedOn: new Date(),
};

const BankAccountGrid: React.FC<BankAccountGridProps> = ({ onAdd, onEdit, bankAccounts }) => {
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState<IBankAccountCredentails>({ ...defaultBankAccount });
  const [editIdx, setEditIdx] = React.useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, CreatedOn: new Date(), LastUpdatedOn: new Date() });
    setOpen(false);
    setForm({ ...defaultBankAccount });
  };

  const handleEdit = (rec: IBankAccountCredentails, idx: number) => {
    setForm({ ...rec });
    setEditIdx(idx);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx !== null) {
      onEdit({ ...form, LastUpdatedOn: new Date() }, editIdx);
    }
    setEditOpen(false);
    setForm({ ...defaultBankAccount });
    setEditIdx(null);
  };

  const getBankAccountColumns = (onEdit: (row: IBankAccountCredentails, idx: number) => void): GridColDef[] => [
  { field: 'AccountHolderName', headerName: 'Account Holder', flex: 1, filterable: true, sortable: true },
  { field: 'BankName', headerName: 'Bank', flex: 1, filterable: true, sortable: true },
  { field: 'AccountType', headerName: 'Type', flex: 1, filterable: true, sortable: true },
  { field: 'AccountNumber', headerName: 'Account #', flex: 1, filterable: true, sortable: true },
  { field: 'CustomerId', headerName: 'Customer ID', flex: 1, filterable: true, sortable: true },
  { field: 'LoginId', headerName: 'Login ID', flex: 1, filterable: true, sortable: true },
  { field: 'NetbankingUrl', headerName: 'Netbanking URL', flex: 1 },
  { field: 'CreatedOn', headerName: 'Created', flex: 1, filterable: true, sortable: true },
  { field: 'LastUpdatedOn', headerName: 'Updated', flex: 1, filterable: true, sortable: true },
  {
    field: 'edit',
    headerName: 'Edit',
    flex: 0.5,
    sortable: false,
    filterable: false,
    renderCell: (params: any) => (
      <Button variant="text" color="primary" onClick={() => onEdit(params.row, params.row.id)}>
        Edit
      </Button>
    ),
  },
];

  const columns = React.useMemo(() => getBankAccountColumns(handleEdit), [bankAccounts]);
  const rows = bankAccounts.map((row, i) => ({ id: i, ...row }));

  return (
    <Box p={2} sx={{ height: 400, width: '98%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Bank Account Credentials</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Add New</Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        pageSizeOptions={[5, 10, 20]}
        autoHeight={false}
      />
      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 8 }}>
          <Typography variant="h6" mb={2}>Add Bank Account</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {Object.keys(defaultBankAccount).map((key) => (
                key !== 'CreatedOn' && key !== 'LastUpdatedOn' ? (
                  <Grid key={key as string}>
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                ) : null
              ))}
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </Box>
          </form>
        </Paper>
      </Modal>
      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 8 }}>
          <Typography variant="h6" mb={2}>Edit Bank Account</Typography>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2}>
              {Object.keys(defaultBankAccount).map((key) => (
                key !== 'CreatedOn' && key !== 'LastUpdatedOn' ? (
                  <Grid key={key as string}>
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                ) : null
              ))}
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button onClick={() => setEditOpen(false)} sx={{ mr: 2 }}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </Box>
          </form>
        </Paper>
      </Modal>
    </Box>
  );
};

export default BankAccountGrid;