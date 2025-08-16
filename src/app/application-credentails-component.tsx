import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IApplicationCredentails } from '../entities/db-entities/application-credentails';

const defaultAppCred: IApplicationCredentails = {
  ApplicationName: '',
  UserName: '',
  Password: '',
  LoginUrl: '',
  AdditionalInfo: {},
};

const getAppColumns = (onEdit: (row: IApplicationCredentails, idx: number) => void): GridColDef[] => [
  { field: 'ApplicationName', headerName: 'Application', flex: 1, filterable: true, sortable: true },
  { field: 'UserName', headerName: 'User Name', flex: 1, filterable: true, sortable: true },
  { field: 'Password', headerName: 'Password', flex: 1 },
  { field: 'LoginUrl', headerName: 'Login URL', flex: 1, filterable: true, sortable: true },
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

interface ApplicationCredentialsComponentProps {
  onAdd: (rec: IApplicationCredentails) => void;
  onEdit: (rec: IApplicationCredentails, idx: number) => void;
  appCredentials: IApplicationCredentails[];
}

const ApplicationCredentialsComponent: React.FC<ApplicationCredentialsComponentProps> = ({ onAdd, onEdit, appCredentials }) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<IApplicationCredentails>({ ...defaultAppCred });
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form });
    setOpen(false);
    setForm({ ...defaultAppCred });
  };

  const handleEdit = (rec: IApplicationCredentails, idx: number) => {
    setForm({ ...rec });
    setEditIdx(idx);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx !== null) {
      onEdit({ ...form }, editIdx);
    }
    setEditOpen(false);
    setForm({ ...defaultAppCred });
    setEditIdx(null);
  };

  const columns = React.useMemo(() => getAppColumns(handleEdit), [appCredentials]);
  const rows = appCredentials.map((row, i) => ({ id: i, ...row }));

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
          <Typography variant="h6" mb={2}>Add Application Credential</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {Object.keys(defaultAppCred).map((key) => (
                key !== 'AdditionalInfo' ? (
                  <Grid key={key as string}>
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={form[key as keyof IApplicationCredentails] as string}
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
          <Typography variant="h6" mb={2}>Edit Application Credential</Typography>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2}>
              {Object.keys(defaultAppCred).map((key) => (
                key !== 'AdditionalInfo' ? (
                  <Grid key={key as string}>
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={form[key as keyof IApplicationCredentails] as string}
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

export default ApplicationCredentialsComponent;
