import { AccountType, IBankAccountCredentails, IBasicAccountDetails, ICardDetails } from "../../entities/db-entities/bank-account-credentails";
import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField, Grid, Select, MenuItem, Tabs, Tab } from '@mui/material';
import { IApplicationCredentials } from '../../entities/db-entities/application-credentails';
import { v4 as uuidv4 } from 'uuid';
import { DataGrid } from '@mui/x-data-grid';
import AddAddtionalInfoComponent from '../common-components/add-additional-info-component';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';
import AddAdditionalInfoComponent from "../common-components/add-additional-info-component";
import BasicDetailsComponent from "./basic-details-component";
import { IExtensibleProperties } from "../../entities/db-entities/extensible-properties";
import AdditionalInfoListComponent from "./additional-info-list";
import CardDetailsComponent from './card-details-list-component'
interface IAddBankAccountCredentialsComponentProps {
    onAddBankAccountCredentials: (rec: IBankAccountCredentails) => void;
    onEditBankAccountCredentials: (rec: IBankAccountCredentails) => void;
    onCancelAddBankAccountCredentials: () => void;
    bankAccountCredentials: IBankAccountCredentails;
    mode: 'add' | 'edit';
}

const AddBankAccountCredentialsComponent: React.FC<IAddBankAccountCredentialsComponentProps> = (props) => {
    // Component implementation

    const onFormSubmit = (evt: any) => {
        evt.preventDefault();
    }

    const defaultBankAccountCredentails: IBankAccountCredentails = {
        CreatedOn: new Date(),
        LastUpdatedOn: new Date(),
        AdditionalInfo: {},
        CreditCardDetails: [],
        DebitCardDetails: [],
        BasicAccountDetails: {
            AccountHolderName: "",
            BankName: "",
            AccountType: "",
            OtherAccountType: "",
            AccountNumber: "",
            CustomerId: "",
            LoginId: "",
            Password: "",
            TransactionPassword: "",
            TelephoneBankingPin: "",
            NetbankingUrl: "",
            ApplicationName: ""
        }
    }
    const [bankAccountCredentails, setBankAccountCredentails] = useState<IBankAccountCredentails | null>(props.bankAccountCredentials || defaultBankAccountCredentails);

    const [form, setForm] = useState<IBankAccountCredentails>({ ...defaultBankAccountCredentails });
    const [addAddtionalInfoModalOpen, setAddAddtionalInfoModalOpen] = useState(false);
    const copyContentToClipBoard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Content copied to clipboard');
        }).catch((err) => {
            console.error('Error copying content to clipboard:', err);
        });
    };

    const onAdditionalInfoUpdate = (additionalInfo: IExtensibleProperties) => {
        setBankAccountCredentails(prevState => ({
            ...prevState,
            AdditionalInfo: {
                ...prevState.AdditionalInfo,
                ...additionalInfo
            }
        }));
    };

    const onDeleteAddtionalinfo = (key: string): void => {
        var credentails = bankAccountCredentails;
        delete credentails.AdditionalInfo[key];
        setBankAccountCredentails({ ...credentails });
    }
    const onAddAdditionalInfo = (key: string, value: string): void => {
        var credentails = bankAccountCredentails;
        credentails.AdditionalInfo[key] = value;
        setBankAccountCredentails(credentails);
    }
    const onCancelAddBankAccountCredentials = (): void => {
        setBankAccountCredentails(null);
        props.onCancelAddBankAccountCredentials();
    }
    const additionalInfoRows = bankAccountCredentails ? Object.entries(bankAccountCredentails.AdditionalInfo).map(([key, value], i) => ({
        id: i,
        key: key,
        value: value,
    })) : [];
    const additionalInfoColumns = [
        { field: 'key', headerName: 'Key', flex: 1 },
        {
            field: 'value', headerName: 'Value', flex: 1,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div >
                        {params.row.value}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy Value' onClick={() => copyContentToClipBoard(params.row.value)} aria-label="edit">
                            <ContentCopy />
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
    const onHtmlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const [tab, setTab] = React.useState(0);

    function onBasicAccountDetailsChange(e: IBasicAccountDetails): void {
        bankAccountCredentails.BasicAccountDetails = e;
        setBankAccountCredentails({ ...bankAccountCredentails });
    }

    function onNextButtonClick(): void {
        setTab(tab < 3 ? tab + 1 : tab);
    }

    function onCreditCardListUpdate(details: ICardDetails[]): void {
        //throw new Error("Function not implemented.");
        bankAccountCredentails.CreditCardDetails = details;
        setBankAccountCredentails({ ...bankAccountCredentails });
    }

    function onDebitCardListUpdate(details: ICardDetails[]): void {
        bankAccountCredentails.DebitCardDetails = details;
        setBankAccountCredentails({ ...bankAccountCredentails });
    }

    return (
        <Paper sx={{ p: 4, width: '65vw', height: '65vh', mx: 'auto', my: 8, border: '1px solid #eee' }}>
            <Typography variant="h6" mb={2}>Add Bank Account Details</Typography>
            <form onSubmit={onFormSubmit}>
                <Box sx={{ overflow: 'auto', paddingTop: 2 }}>
                    <Tabs sx={{ bgcolor: '#f5f5f5' }} value={tab} onChange={(_e, v) => setTab(v)} centered>
                        <Tab label="Basic Details" />
                        <Tab label="Additional Info" />
                        <Tab label="Debit Card Info" />
                        <Tab label="Credit Card Info" />
                    </Tabs>
                    <Box sx={{ mt: 3, bgcolor: '#fff', border: '1px inset #ccc', borderRadius: 2, p: 1, minHeight: 320 }}>
                        {tab === 0 && <BasicDetailsComponent BasicAccountDetails={bankAccountCredentails.BasicAccountDetails} onBasicAccountDetailsChange={onBasicAccountDetailsChange} onCancelAddBankAccountCredentials={onCancelAddBankAccountCredentials} onNextButtonClick={onNextButtonClick} />}
                        {tab === 1 && <AdditionalInfoListComponent additionalInfo={bankAccountCredentails.AdditionalInfo} onAdditionalInfoUpdate={onAdditionalInfoUpdate} />}
                        {tab === 2 && <CardDetailsComponent cardDetails={bankAccountCredentails.CreditCardDetails} onListUpdate={onCreditCardListUpdate} />}
                        {tab === 3 && <CardDetailsComponent cardDetails={bankAccountCredentails.DebitCardDetails} onListUpdate={onDebitCardListUpdate} />}
                    </Box>
                </Box>
            </form>
        </Paper>
    )
};

export default AddBankAccountCredentialsComponent;
