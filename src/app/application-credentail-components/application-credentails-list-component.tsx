import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IApplicationCredentials } from '../../entities/db-entities/application-credentails';
import AddApplicationCredentialsComponent from './add-application-credentails-component';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';
import MaskedCell from '../common-components/masked-cell-component';
import { useUserSettings } from '../services/user-settings-context';
import { IUserSettings } from '../../entities/db-entities/user-settings';

interface ApplicationCredentialsListComponentProps {

}

async function readApplicationCredentialsFromStorage(userSettings: IUserSettings): Promise<IApplicationCredentials[]> {
    
    const workspacePath = userSettings.WorkspacePath;
    const encryptionKey = userSettings.EncryptionKey; 

    if (!workspacePath) return [];
    try {
        const result = await window.api.readApplicationCredentialsFile(workspacePath, encryptionKey);
        if (result.success) {
            return result.fileContent as IApplicationCredentials[];
        } else {
            await window.api.logError('Failed to read application credentials file: ' + result.error);
            return [];
        }
    } catch (err) {
        await window.api.logError('Error reading application credentials file: ' + (err instanceof Error ? err.message : String(err)));
        window.api.showAlert('Error Reading Application Credentials File', 'Error reading application credentials file', 'error');
        return [];
    }
}

async function writeApplicationCredentialsToStorage(data: IApplicationCredentials[], userSettings: IUserSettings): Promise<void> {

    const workspacePath = userSettings.WorkspacePath;
    const encryptionKey = userSettings.EncryptionKey;

    if (!workspacePath) {
        await window.api.logError('Workspace path not found');
        window.api.showAlert('Workspace Path Not Found', 'Workspace path not found', 'error');
        return;
    }
    try {
        const result = await window.api.writeApplicationCredentialsFile(workspacePath, data, encryptionKey);
        if (result.success) {
            await window.api.logMessage('info', 'Application credentials data written successfully');
        } else {
            await window.api.logError('Failed to write application credentials data: ' + result.error);
        }
    } catch (err) {
        await window.api.logError('Error writing application credentials file: ' + (err instanceof Error ? err.message : String(err)));
        window.api.showAlert('Error Writing Application Credentials File', 'Error writing application credentials file', 'error');
    }
}

const ApplicationCredentialsListComponent: React.FC<ApplicationCredentialsListComponentProps> = () => {
    const userSettings = useUserSettings();
    const [applicationCredentailList, setAppCredentialList] = useState<IApplicationCredentials[]>([]);
    const [bankAccountCredentailRows, setBankAccountCredentailRows] = useState([]);
    const [addApplicationCredentailsFormMode, setAddApplicationCredentailsFormMode] = useState<"add" | "edit">('add');

    const fetchApplicationCredentailsData = async () => {
        const appCredentialsData = await readApplicationCredentialsFromStorage(userSettings);
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
    const getAddtionalInfoPropsForTitle = (additionalInfo: any): string => {
        var result = '';
        if (additionalInfo && typeof additionalInfo === 'object') {
            Object.keys(additionalInfo).forEach((key) => {
                result += `${key}: ${additionalInfo[key]}\n`;
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
                        <IconButton size="small" title='Copy User Name' onClick={() => copyContentToClipBoard(params.row.UserName)} aria-label="edit">
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </div>
                </div>
            )
        },
        {
            field: 'Password',
            headerName: 'Password',
            flex: 1,
            renderCell: (params: any) => <MaskedCell value={params.value} />
        },
        { 
            field: 'LoginUrl', 
            headerName: 'Login URL', 
            flex: 1, 
            filterable: true, 
            sortable: true,
            renderCell: (params: any) => {
                            const url = params.value;
                            if (!url) return null;
                            const handleClick = (e: React.MouseEvent) => {
                                e.preventDefault();
                                window.api.openExternal(url);
                            };
                            return (
                                <a href={url} onClick={handleClick} style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            );
                        }
        },
        {
            field: 'AdditionalInfo', headerName: 'Additional Info', flex: 1, filterable: true, sortable: true,  
            renderCell: (params: any) => (
                <div title={getAddtionalInfoPropsForTitle(params.row.AdditionalInfo)}>
                    {getAddtionalInfoPropsForDisplay(params.row.AdditionalInfo)}
                </div>
            ),
            
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
        //var result = window.confirm("Are you sure you want to delete this record?");
        var result = await window.api.showConfirm("Confirm Deletion", "Are you sure you want to delete this record?", "warning");
        if (result.response === 0) { //Ok
            applicationCredentailList.splice(idx, 1);
            setAppCredentialList(applicationCredentailList);
            await writeApplicationCredentialsToStorage(applicationCredentailList, userSettings);
            await fetchApplicationCredentailsData();
        }
    }

    const [selectedAppCredentials, setSelectedAppCredentials] = useState<IApplicationCredentials | null>(null);

    const onAddAppCredentails = async (rec: IApplicationCredentials): Promise<void> => {
        var appCredentials = applicationCredentailList;
        appCredentials.push(rec);
        setAppCredentialList(appCredentials);
        await writeApplicationCredentialsToStorage(appCredentials, userSettings);
        await fetchApplicationCredentailsData();
        setAddApplicationCredentailModelDialogOpen(false);
    };

    const onUpdateAppCredentails = async (rec: IApplicationCredentials): Promise<void> => {
        applicationCredentailList[editApplicationCredentailsIndex] = rec;
        await writeApplicationCredentialsToStorage(applicationCredentailList, userSettings);
        await fetchApplicationCredentailsData();
        setAddApplicationCredentailModelDialogOpen(false);
    }

    var columns = React.useMemo(() => getAppColumns(openEditApplicationCredentailsModal), [openEditApplicationCredentailsModal]);

    return (
        <Box p={2} sx={{ height: 400, width: '98%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Application Details</Typography>
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
