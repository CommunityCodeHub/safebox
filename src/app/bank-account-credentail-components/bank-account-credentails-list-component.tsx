import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IBankAccountCredentails } from '../../entities/db-entities/bank-account-credentails';
import AddBankAccountCredentialsComponent from './add-bank-account-credentails-component';
import CopyCell from '../common-components/copy-cell-component';
import MaskedCell from '../common-components/masked-cell-component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserSettings } from '../services/user-settings-context';
import { IUserSettings } from '../../entities/db-entities/user-settings';


interface IBankAccountCredentialsListComponentProps {

}

async function readBankAccountCredentialsFromStorage(userSettings: IUserSettings): Promise<IBankAccountCredentails[]> {
        
    const workspacePath = userSettings.WorkspacePath; 
    const encryptionKey = userSettings.EncryptionKey; 

    if (!workspacePath) return [];

    try {
        const result = await window.api.readBankAccountCredentialsFile(workspacePath, encryptionKey);
        if (result.success) {
            return result.fileContent as IBankAccountCredentails[];
        } else {
            console.error('Failed to read bank account credentials file:', result.error);
            return [];
        }
    } catch (err) {
        console.error('Error reading bank account credentials file:', err);
        alert('Error reading bank account credentials file');
        return [];
    }
}

async function writeBankAccountCredentialsToStorage(data: IBankAccountCredentails[], userSettings: IUserSettings): Promise<void> {
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
            console.log('Bank account credentials data written successfully');
        } else {
            console.error('Failed to write bank account credentials data:', result.error);
        }
    } catch (err) {
        console.error('Error writing bank account credentials file:', err);
        alert('Error writing bank account credentials file');
    }
}

const BankAccountCredentialListComponent: React.FC<IBankAccountCredentialsListComponentProps> = () => {
    const userSettings = useUserSettings();

    const getBankAccountColumns = (onEdit: (row: IBankAccountCredentails, idx: number) => void): GridColDef[] => [
        { field: 'AccountHolderName', headerName: 'Account Holder', flex: 0.75, filterable: true, sortable: true },
        { field: 'BankName', headerName: 'Bank', flex: 0.5, filterable: true, sortable: true },
        { field: 'AccountType', headerName: 'Type', flex: 0.5, filterable: true, sortable: true },
        { field: 'AccountNumber', headerName: 'Account #', flex: 1, filterable: true, sortable: true },
        {
            field: 'CustomerId',
            headerName: 'Customer ID',
            flex: 1,
            filterable: true,
            sortable: true,
            renderCell: (params: any) => <CopyCell value={params.value} />
        },
        {
            field: 'LoginId',
            headerName: 'Login ID',
            flex: 1,
            filterable: true,
            sortable: true,
            renderCell: (params: any) => <CopyCell value={params.value} />
        },
        {
            field: 'Password',
            headerName: 'Password',
            flex: 1,
            filterable: true,
            sortable: true,
            renderCell: (params: any) => <MaskedCell value={params.value} />
        },
        {
            field: 'TransactionPassword',
            headerName: 'Transaction Password',
            flex: 1,
            filterable: true,
            sortable: true,
            renderCell: (params: any) => <MaskedCell value={params.value} />
        },
        { field: 'TelephoneBankingPin', headerName: 'Telephone Banking Pin', flex: 1, filterable: true, sortable: true },
        {
            field: 'NetbankingUrl',
            headerName: 'Netbanking URL',
            flex: 1,
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
        { field: 'AdditionalInfo', headerName: 'Additional Info', flex: 1 },
        { field: 'LastUpdatedOn', headerName: 'Last Updated On', flex: 1, filterable: true, sortable: true },
        {
            field: 'modify',
            headerName: 'Modify',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Box display="flex">
                    <IconButton color="primary" title='Edit this Application Credential' onClick={() => onEditBankAccountDetails(params.row.id)} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" title='Delete this Application Credential' onClick={() => onDeleteBankAccountDetails(params.row, params.row.id)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];
    const [bankAccountDetailsList, setBankAccountDetailsList] = React.useState<IBankAccountCredentails[]>([]);
    const [addBankAccountCredentailModelDialogOpen, setAddBankAccountCredentailModelDialogOpen] = useState(false);
    const [editBankAccountCredentailsIndex, setEditBankAccountCredentailsIndex] = useState<number | null>(null);
    const [selectedBankAccountCredentials, setSelectedBankAccountCredentials] = useState<IBankAccountCredentails | null>(null);
    const [addBankAccountCredentailsFormMode, setAddBankAccountCredentailsFormMode] = useState<'add' | 'edit'>('add');
    const [bankAccountCredentialRows, setBankAccountCredentialRows] = useState([]);
    const [bankAccountCredentialRowForDisplay, setBankAccountCredentialRowForDisplay] = useState<any | null>(null);


    const openEditBankAccountCredentailsModal = (rec: IBankAccountCredentails, idx: number) => {
        setEditBankAccountCredentailsIndex(idx);
        setSelectedBankAccountCredentials(rec);
        setAddBankAccountCredentailModelDialogOpen(true);
        setAddBankAccountCredentailsFormMode('edit');
    };

    const openAddBankAccountCredentailsModal = () => {
        setSelectedBankAccountCredentials(null);
        setAddBankAccountCredentailModelDialogOpen(true);
        setAddBankAccountCredentailsFormMode('add');
    }
    const onAddBankAccountCredentials = async (rec: IBankAccountCredentails): Promise<void> => {
        var bankAccountCredentails = bankAccountDetailsList;
        bankAccountCredentails.push(rec);
        setBankAccountDetailsList(bankAccountCredentails);
        await writeBankAccountCredentialsToStorage(bankAccountCredentails, userSettings);
        await fetchBankAccountCredentailsData();
        setAddBankAccountCredentailModelDialogOpen(false);
    };

    const onUpdateBankAccountCredentials = async (rec: IBankAccountCredentails): Promise<void> => {
        bankAccountDetailsList[editBankAccountCredentailsIndex] = rec;
        await writeBankAccountCredentialsToStorage(bankAccountDetailsList, userSettings);
        await fetchBankAccountCredentailsData();
        setAddBankAccountCredentailModelDialogOpen(false);
    }

    const onDeleteBankAccountDetails = async (rec: IBankAccountCredentails, idx: number): Promise<void> => {
        var result = window.confirm("Are you sure you want to delete this bank account details?");
        if (!result) return;

        var bankAccountCredentails = bankAccountDetailsList;
        bankAccountCredentails.splice(idx, 1);
        setBankAccountDetailsList([...bankAccountCredentails]);
        await writeBankAccountCredentialsToStorage(bankAccountCredentails, userSettings);
        await fetchBankAccountCredentailsData();
    };

    const onEditBankAccountDetails = (idx: number) => {
        var rows = bankAccountDetailsList.filter((item: any)=>item.id == idx); 
        openEditBankAccountCredentailsModal(rows[0], idx);
    };

    const fetchBankAccountCredentailsData = async () => {
        const bankAccountDetailsList = await readBankAccountCredentialsFromStorage(userSettings);
        if (Array.isArray(bankAccountDetailsList)) {
            setBankAccountDetailsList(bankAccountDetailsList);
            var dataRow: any;
            var rows: any = [];
            bankAccountDetailsList.forEach((row: any, i: number) => {
                dataRow = {};
                dataRow.id = i;
                Object.keys(row).forEach((prop: string) => {
                    dataRow[prop] = row[prop];
                });

                rows.push(dataRow);
            });
            setBankAccountCredentialRows(rows);
        }
    };
    useEffect(() => {
        fetchBankAccountCredentailsData();
    }, []);

    useEffect(() => {
        var dataRowsForDisplay: any[] = [];
        bankAccountCredentialRows.forEach((row: any) => {
            var dataRowForDisplay: any = {};
            // Do something with each row
            dataRowForDisplay.id = row.id;
            dataRowForDisplay.AccountHolderName = row.BasicAccountDetails.AccountHolderName;
            dataRowForDisplay.BankName = row.BasicAccountDetails.BankName;
            if (row.BasicAccountDetails.AccountType === "Other"){
                dataRowForDisplay.AccountType = row.BasicAccountDetails.OtherAccountType;
            }
            else {
                dataRowForDisplay.AccountType = row.BasicAccountDetails.AccountType;
            }
            dataRowForDisplay.AccountNumber = row.BasicAccountDetails.AccountNumber;
            dataRowForDisplay.CustomerId = row.BasicAccountDetails.CustomerId;
            dataRowForDisplay.LoginId = row.BasicAccountDetails.LoginId;
            dataRowForDisplay.Password = row.BasicAccountDetails.Password;
            dataRowForDisplay.TransactionPassword = row.BasicAccountDetails.TransactionPassword;
            dataRowForDisplay.TelephoneBankingPin = row.BasicAccountDetails.TelephoneBankingPin;
            dataRowForDisplay.NetbankingUrl = row.BasicAccountDetails.NetbankingUrl;
            dataRowForDisplay.ApplicationName = row.BasicAccountDetails.ApplicationName;
            dataRowForDisplay.AdditionalInfo = '';
            if (row.AdditionalInfo) {
                dataRowForDisplay.AdditionalInfo = Object.keys(row.AdditionalInfo).map((key) => {
                    return `${key}: ${row.AdditionalInfo[key]}`;
                }).join(',');
            }
            dataRowForDisplay.LastUpdatedOn = row.LastUpdatedOn;
            dataRowsForDisplay.push(dataRowForDisplay);
        });
        setBankAccountCredentialRowForDisplay(dataRowsForDisplay);
    }, [bankAccountCredentialRows])

    var columns = React.useMemo(() => getBankAccountColumns(openEditBankAccountCredentailsModal), [openEditBankAccountCredentailsModal]);

    return (
        <Box p={2} sx={{ height: 400, width: '98%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Bank Account Credentials</Typography>
                <Button variant="contained" color="primary" onClick={() => openAddBankAccountCredentailsModal()}>Add New</Button>
            </Box>
            <DataGrid
                rows={bankAccountCredentialRowForDisplay}
                columns={columns}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                pageSizeOptions={[5, 10, 20]}
                autoHeight={false}
                sx={{
                    '& .MuiDataGrid-columnHeaderTitle': {
                        whiteSpace: 'normal',
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                    },
                }}
            />
            {/* Add Modal */}
            <Modal open={addBankAccountCredentailModelDialogOpen} onClose={() => setAddBankAccountCredentailModelDialogOpen(false)}>
                {/* Add Bank Account Component */}
                <AddBankAccountCredentialsComponent
                    onAddBankAccountCredentials={onAddBankAccountCredentials}
                    onEditBankAccountCredentials={onUpdateBankAccountCredentials}
                    mode={addBankAccountCredentailsFormMode}
                    onCancelAddBankAccountCredentials={() => setAddBankAccountCredentailModelDialogOpen(false)}
                    bankAccountCredentials={selectedBankAccountCredentials}
                />
            </Modal>
            {/* Edit Modal */}

        </Box>
    );
};

export default BankAccountCredentialListComponent;