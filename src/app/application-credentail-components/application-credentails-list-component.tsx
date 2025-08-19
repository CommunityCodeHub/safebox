import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IApplicationCredentials } from '../../entities/db-entities/application-credentails';
import AddApplicationCredentialsComponent from './add-application-credentails-component';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';

interface ApplicationCredentialsListComponentProps {

}

async function readApplicationCredentialsFromStorage(): Promise<IApplicationCredentials[]> {
    const username = sessionStorage.getItem('UserName');
    const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();
    if (!workspacePath) return [];

    try {
        const result = await window.api.readApplicationCredentialsFile(workspacePath);
        if (result.success) {
            return result.fileContent as IApplicationCredentials[];
        } else {
            console.error('Failed to read application credentials file:', result.error);
            return [];
        }
    } catch (err) {
        console.error('Error reading application credentials file:', err);
        alert('Error reading application credentials file');
        return [];
    }
}

async function writeApplicationCredentialsToStorage(data: IApplicationCredentials[]): Promise<void> {
    const username = sessionStorage.getItem('UserName');
    const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();

    if (!workspacePath) {
        console.error('Workspace path not found');
        alert('Workspace path not found');
        return;
    }

    try {
        const result = await window.api.writeApplicationCredentialsFile(workspacePath, data);
        if (result.success) {
            console.log('Application credentials data written successfully');
        } else {
            console.error('Failed to write application credentials data:', result.error);
        }
    } catch (err) {
        console.error('Error writing application credentials file:', err);
        alert('Error writing application credentials file');
    }
}

const ApplicationCredentialsListComponent: React.FC<ApplicationCredentialsListComponentProps> = () => {

    const [applicationCredentailList, setAppCredentialList] = useState<IApplicationCredentials[]>([]);
    const [bankAccountCredentailRows, setBankAccountCredentailRows] = useState([]);
    const [addApplicationCredentailsFormMode, setAddApplicationCredentailsFormMode] = useState<"add" | "edit">('add');

    const fetchApplicationCredentailsData = async () => {
        const appCredentialsData = await readApplicationCredentialsFromStorage();
        if (Array.isArray(appCredentialsData)) {
            setAppCredentialList(appCredentialsData);
            var dataRow: any;
            var rows: any = [];
            appCredentialsData.forEach((row: any, i: number) => {
                dataRow = {};
                dataRow.id = i;
                Object.keys(row).forEach((prop: string) => {
                    dataRow[prop] = row[prop];
                });

                rows.push(dataRow);
            });
            setBankAccountCredentailRows(rows);
        }
    };

    useEffect(() => {
        fetchApplicationCredentailsData();
    }, []);

    const [addApplicationCredentailModelDialogOpen, setAddApplicationCredentailModelDialogOpen] = useState(false);

    const [editApplicationCredentailsIndex, setEditApplicationCredentailsIndex] = useState<number | null>(null);
    const getAddtionalInfoPropsForDisplay = (additionalInfo: any): string => {
        var result = '';
        if (additionalInfo && typeof additionalInfo === 'object') {
            Object.keys(additionalInfo).forEach((key) => {
                result += `${key}: ${additionalInfo[key]},`;
            });
        }
        return result;
    }

    const copyContentToClipBoard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Content copied to clipboard');
        }).catch((err) => {
            console.error('Error copying content to clipboard:', err);
        });
    };

    const getUrlStringForDisplay = (url: string): string => {
        if (!url) return '';
        if (url.length > 20) {
            return `${url.slice(0, 20)}...`;
        }
        return url;
    }

    const getAppColumns = (onEdit: (row: IApplicationCredentials, idx: number) => void): GridColDef[] => [
        { field: 'ApplicationName', headerName: 'Application', flex: 1, filterable: true, sortable: true },
        {
            field: 'UserName',
            headerName: 'User Name',
            flex: 1, filterable: true,
            sortable: true,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div >
                        {params.row.UserName}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy User Name' onClick={() => copyContentToClipBoard(params.row.UserName)} aria-label="edit">
                            <ContentCopy />
                        </IconButton>
                    </div>
                </div>
            )
        },
        {
            field: 'Password',
            headerName: 'Password',
            flex: 1,
            renderCell: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        {params.row.Password}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy Password' onClick={() => copyContentToClipBoard(params.row.Password)} aria-label="edit">
                            <ContentCopy />
                        </IconButton>
                    </div>
                </div>
            )
        },
        { 
            field: 'LoginUrl', 
            headerName: 'Login URL', 
            flex: 1, 
            filterable: true, 
            sortable: true,
            renderCell: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        {getUrlStringForDisplay(params.row.LoginUrl)}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy Login URL' onClick={() => copyContentToClipBoard(params.row.LoginUrl)} aria-label="edit">
                            <ContentCopy />
                        </IconButton>
                    </div>
                </div>
                
            )
        },
        {
            field: 'AdditionalInfo', headerName: 'Additional Info', flex: 1, filterable: true, sortable: true,
            renderCell: (params: any) => (
                <div >
                    {getAddtionalInfoPropsForDisplay(params.row.AdditionalInfo)}
                </div>
            )
        },
        { field: 'CreatedOn', headerName: 'Created On', flex: 1, filterable: true, sortable: true },
        { field: 'LastUpdatedOn', headerName: 'Last Updated On', flex: 1, filterable: true, sortable: true },
        {
            field: 'modify',
            headerName: 'Modify',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Box>
                    <IconButton color="primary" title='Edit this Application Credential' onClick={() => openEditApplicationCredentailsModal(params.row, params.row.id)} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" title='Delete this Application Credential' onClick={() => deleteApplicationCredentailRow(params.row, params.row.id)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },

    ];

    const openEditApplicationCredentailsModal = (rec: IApplicationCredentials, idx: number) => {
        setEditApplicationCredentailsIndex(idx);
        setSelectedAppCredentials(rec);
        setAddApplicationCredentailModelDialogOpen(true);
        setAddApplicationCredentailsFormMode('edit');
    };
    const openAddApplicationCredentailsModal = () => {
        setSelectedAppCredentials(null);
        setAddApplicationCredentailModelDialogOpen(true);
        setAddApplicationCredentailsFormMode('add');
    }

    const deleteApplicationCredentailRow = async (rec: IApplicationCredentials, idx: number) => {
        var result = window.confirm("Are you sure you want to delete this record?");
        if (result) {
            applicationCredentailList.splice(idx, 1);
            setAppCredentialList(applicationCredentailList);
            await writeApplicationCredentialsToStorage(applicationCredentailList);
            await fetchApplicationCredentailsData();
        }
    }

    const [selectedAppCredentials, setSelectedAppCredentials] = useState<IApplicationCredentials | null>(null);

    const onAddAppCredentails = async (rec: IApplicationCredentials): Promise<void> => {
        var appCredentials = applicationCredentailList;
        appCredentials.push(rec);
        setAppCredentialList(appCredentials);
        await writeApplicationCredentialsToStorage(appCredentials);
        await fetchApplicationCredentailsData();
        setAddApplicationCredentailModelDialogOpen(false);
    };

    const onUpdateAppCredentails = async (rec: IApplicationCredentials): Promise<void> => {
        applicationCredentailList[editApplicationCredentailsIndex] = rec;
        await writeApplicationCredentialsToStorage(applicationCredentailList);
        await fetchApplicationCredentailsData();
        setAddApplicationCredentailModelDialogOpen(false);
    }

    var columns = React.useMemo(() => getAppColumns(openEditApplicationCredentailsModal), [openEditApplicationCredentailsModal]);

    return (
        <Box p={2} sx={{ height: 400, width: '98%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Bank Account Credentials</Typography>
                <Button variant="contained" color="primary" onClick={() => openAddApplicationCredentailsModal()}>Add New</Button>
            </Box>
            <DataGrid
                rows={bankAccountCredentailRows}
                columns={columns}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                pageSizeOptions={[5, 10, 20]}
                autoHeight={false}
            />

            <Modal open={addApplicationCredentailModelDialogOpen} onClose={() => setAddApplicationCredentailModelDialogOpen(false)}>
                <AddApplicationCredentialsComponent
                    onAddAppCredentails={onAddAppCredentails}
                    onEditAppCredentails={onUpdateAppCredentails}
                    mode={addApplicationCredentailsFormMode}
                    onCancelAddAppCredentails={() => setAddApplicationCredentailModelDialogOpen(false)}
                    appCredentials={selectedAppCredentials}
                />
            </Modal>
        </Box>
    );
};

export default ApplicationCredentialsListComponent;
