
import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField, Grid, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
    
import { IApplicationCredentials } from '../../entities/db-entities/application-credentails';
import { v4 as uuidv4 } from 'uuid';
import { DataGrid } from '@mui/x-data-grid';
import AddAddtionalInfoComponent from '../common-components/add-additional-info-component';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { useUserSettings } from '../services/user-settings-context';

interface ApplicationCredentialsComponentProps {
    onAddAppCredentails: (rec: IApplicationCredentials) => void;
    onEditAppCredentails: (rec: IApplicationCredentials) => void;
    onCancelAddAppCredentails: () => void;
    appCredentials: IApplicationCredentials;
    mode: 'add' | 'edit';
}

const AddApplicationCredentialsComponent: React.FC<ApplicationCredentialsComponentProps> = (props) => {
    const userSettings = useUserSettings();
    var defaultAppCred: IApplicationCredentials = {
        ApplicationName: '',
        UserName: '',
        Password: '',
        LoginUrl: '',
        AdditionalInfo: {},
        ApplicationCredentailId: uuidv4(),
        CreatedOn: new Date(),
        LastUpdatedOn: new Date(),
    };

    if (props.appCredentials) {
        defaultAppCred = props.appCredentials;
    }

    const [showPassword, setShowPassword] = useState(false);
    const [loginUrlError, setLoginUrlError] = useState('');

    const [appCredentials, setAppCredentials] = useState<IApplicationCredentials | null>(props.appCredentials || defaultAppCred);

    const [form, setForm] = useState<IApplicationCredentials>({ ...defaultAppCred });

    const [addAddtionalInfoModalOpen, setAddAddtionalInfoModalOpen] = useState(false);

    const additionalInfoRows = appCredentials ? Object.entries(appCredentials.AdditionalInfo).map(([key, value], i) => ({
        id: i,
        key: key,
        value: value,
    })) : [];

    const copyContentToClipBoard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            window.api.logMessage('info', 'Content copied to clipboard');
        }).catch((err) => {
            window.api.logError('Error copying content to clipboard: ' + (err instanceof Error ? err.message : String(err)));
        });
    };

    const additionalInfoColumns = [
        { field: 'key', headerName: 'Key', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div >
                        {params.row.value}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton size='small' title='Copy Value' onClick={() => copyContentToClipBoard(params.row.value)} aria-label="edit">
                            <ContentCopy fontSize='small' />
                        </IconButton>
                    </div>
                </div>
            )
        },
        {
            field: 'modify',
            headerName: 'Modify',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Box>
                    <IconButton color="error" onClick={() => onDeleteAddtionalinfo(params.row.key)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
            
        },
    ];

    const onFormSubmit = (evt: any) => {
        evt.preventDefault();
        if (props.mode === 'edit') {
            onEditApplicationCredentials();
        } else {
            onAddApplicationCredentials();
        }
    }

    const onAddApplicationCredentials = () => {
        var credentails = appCredentials;
        credentails.ApplicationName = form.ApplicationName;
        credentails.UserName = form.UserName;
        credentails.Password = form.Password;
        credentails.LoginUrl = form.LoginUrl;
        credentails.ApplicationCredentailId = uuidv4();
        credentails.CreatedOn = new Date();
        credentails.LastUpdatedOn = new Date();
        setAppCredentials(credentails);
        props.onAddAppCredentails(credentails);
    };

    const onEditApplicationCredentials = () => {
        var credentails = appCredentials;
        credentails.ApplicationName = form.ApplicationName;
        credentails.UserName = form.UserName;
        credentails.Password = form.Password;
        credentails.LoginUrl = form.LoginUrl;
        credentails.AdditionalInfo = form.AdditionalInfo;
        credentails.LastUpdatedOn = new Date();

        setAppCredentials(credentails);
        props.onEditAppCredentails(credentails);
    };

    const validateUrl = (url: string) => {
        try {
            if (!url) return '';
            new URL(url);
            return '';
        } catch {
            return 'Enter a valid URL (e.g. https://example.com)';
        }
    };

    const onHtmlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'LoginUrl') {
            setLoginUrlError(validateUrl(value));
        }
        setForm({ ...form, [name]: value });
    };

    const onAddAdditionalInfo = (key: string, value: string): void => {
        var credentails = appCredentials;
        credentails.AdditionalInfo[key] = value;
        setAppCredentials(credentails);
    }


    const onDeleteAddtionalinfo = (key: string): void => {
        var credentails = appCredentials;
        delete credentails.AdditionalInfo[key];
        setAppCredentials({ ...credentails });
    }

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 8 }}>
            <Typography variant="h6" mb={2}>Add Application Credential</Typography>
            <form onSubmit={onFormSubmit}>
                <Grid container spacing={2}>
                    {/* Main fields except RowId, CreatedOn, LastUpdatedOn, AdditionalInfo */}
                    <Grid >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Application Name</Typography>
                            <TextField
                                label="Application Name"
                                name="ApplicationName"
                                value={form.ApplicationName}
                                onChange={onHtmlInputChange}
                                required
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>User Name</Typography>
                            <TextField
                                label="User Name"
                                name="UserName"
                                value={form.UserName}
                                onChange={onHtmlInputChange}
                                required
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Password</Typography>
                            <TextField
                                label="Password"
                                name="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.Password}
                                onChange={onHtmlInputChange}
                                required
                                size="small"
                                sx={{ flex: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword((show) => !show)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Login URL</Typography>
                            <TextField
                                label="Login URL"
                                name="LoginUrl"
                                value={form.LoginUrl}
                                onChange={onHtmlInputChange}
                                size="small"
                                sx={{ flex: 1 }}
                                error={!!loginUrlError}
                                helperText={loginUrlError}
                            />
                        </Box>
                    </Grid>
                    {/* AdditionalInfo grid and Add New button */}
                    <Grid sx={{ width: '100%', paddingTop: 1 }} >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" sx={{ minWidth: 140, mr: 2 }}>Additional Info</Typography>
                            <Button variant="contained" color="secondary" sx={{ width: 120, maxHeight: 30 }} onClick={() => setAddAddtionalInfoModalOpen(true)}>
                                Add New
                            </Button>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <DataGrid
                                rows={additionalInfoRows}
                                columns={additionalInfoColumns}
                                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } }, }}
                                pageSizeOptions={[5, 10, 20]}
                                autoHeight={false}
                            />


                        </Box>

                    </Grid>


                    {/* Additional Info Modal */}
                    <Modal open={addAddtionalInfoModalOpen} onClose={() => setAddAddtionalInfoModalOpen(false)}>
                        <AddAddtionalInfoComponent
                            onAddAddtionalinfo={onAddAdditionalInfo}
                            onClose={() => setAddAddtionalInfoModalOpen(false)}
                        />
                    </Modal>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button onClick={() => props.onCancelAddAppCredentails()} sx={{ mr: 2 }}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">Save</Button>
                </Box>
            </form>
        </Paper>
    )
}

export default AddApplicationCredentialsComponent; 