// CopyCell component for CustomerId with copy button


// MaskedCell component for password fields with show/hide and copy

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField, IconButton, Tooltip } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IBankAccountCredentails } from '../../entities/db-entities/bank-account-credentails';
import { v4 as uuidv4 } from 'uuid';
import AddBankAccountCredentialsComponent from './add-bank-account-credentails-component';
import CopyCell from '../common-components/copy-cell-component';
import MaskedCell from '../common-components/masked-cell-component';


interface IBankAccountCredentialsListComponentProps {

}

async function readBankAccountCredentialsFromStorage(): Promise<IBankAccountCredentails[]> {
    const username = sessionStorage.getItem('UserName');
    const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();
    if (!workspacePath) return [];

    try {
        const result = await window.api.readBankAccountCredentialsFile(workspacePath);
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

async function writeBankAccountCredentialsToStorage(data: IBankAccountCredentails[]): Promise<void> {
    const username = sessionStorage.getItem('UserName');
    const workspacePath = localStorage.getItem(`${username}-workspacePath`)?.toString();

    if (!workspacePath) {
        console.error('Workspace path not found');
        alert('Workspace path not found');
        return;
    }

    try {
        const result = await window.api.writeBankAccountCredentialsFile(workspacePath, data);
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
    const getBankAccountColumns = (onEdit: (row: IBankAccountCredentails, idx: number) => void): GridColDef[] => [
        { field: 'AccountHolderName', headerName: 'Account Holder', flex: 1, filterable: true, sortable: true },
        { field: 'BankName', headerName: 'Bank', flex: 1, filterable: true, sortable: true },
        { field: 'AccountType', headerName: 'Type', flex: 1, filterable: true, sortable: true },
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
            field: 'edit',
            headerName: 'Edit',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Button variant="text" color="primary" onClick={() => onEdit(bankAccountCredentialRows[params.row.id], params.row.id)}>
                    Edit
                </Button>
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
        await writeBankAccountCredentialsToStorage(bankAccountCredentails);
        await fetchBankAccountCredentailsData();
        setAddBankAccountCredentailModelDialogOpen(false);
    };

    const onUpdateBankAccountCredentials = async (rec: IBankAccountCredentails): Promise<void> => {
        bankAccountDetailsList[editBankAccountCredentailsIndex] = rec;
        await writeBankAccountCredentialsToStorage(bankAccountDetailsList);
        await fetchBankAccountCredentailsData();
        setAddBankAccountCredentailModelDialogOpen(false);
    }

    const fetchBankAccountCredentailsData = async () => {
        const bankAccountDetailsList = await readBankAccountCredentialsFromStorage();
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
        var dataRowForDisplay: any = {};
        var dataRowsForDisplay: any[] = [];

        bankAccountCredentialRows.forEach((row: any) => {
            // Do something with each row
            dataRowForDisplay.id = row.id;
            dataRowForDisplay.AccountHolderName = row.BasicAccountDetails.AccountHolderName;
            dataRowForDisplay.BankName = row.BasicAccountDetails.BankName;
            dataRowForDisplay.AccountType = row.BasicAccountDetails.AccountType;
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