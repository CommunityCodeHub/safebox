import { IBankAccountCredentails, IBasicAccountDetails, ICardDetails } from "../../entities/db-entities/bank-account-credentails";
import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';
import BasicDetailsComponent from "./basic-details-component";
import { IExtensibleProperties } from "../../entities/db-entities/extensible-properties";
import AdditionalInfoListComponent from "./additional-info-list";
import CardDetailsComponent from './card-details-list-component'
import { useUserSettings } from "../services/user-settings-context";
interface IAddBankAccountCredentialsComponentProps {
    onAddBankAccountCredentials: (rec: IBankAccountCredentails) => void;
    onEditBankAccountCredentials: (rec: IBankAccountCredentails) => void;
    onCancelAddBankAccountCredentials: () => void;
    bankAccountCredentials: IBankAccountCredentails;
    mode: 'add' | 'edit';
}

const AddBankAccountCredentialsComponent: React.FC<IAddBankAccountCredentialsComponentProps> = (props) => {
    // Component implementation
    var userSettings = useUserSettings();

    const BasicDetailsComponentRef = useRef(null);

    const onFormSubmit = (evt: any) => {
        //bankAccountCredentails 
        if (props.mode == 'add'){
            props.onAddBankAccountCredentials(bankAccountCredentails);
        }
        else {
            props.onEditBankAccountCredentials(bankAccountCredentails);
        }
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
        const copyContentToClipboard = (content: string) => {
            navigator.clipboard.writeText(content).then(() => {
                window.api.logMessage('info', 'Content copied to clipboard');
            }).catch((err) => {
                window.api.logError('Error copying content to clipboard: ' + (err instanceof Error ? err.message : String(err)));
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
                        <IconButton color="secondary" title='Copy Value' onClick={() => copyContentToClipboard(params.row.value)} aria-label="edit">
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

    const onBasicAccountDetailsChange = (e: IBasicAccountDetails): void => {
        bankAccountCredentails.BasicAccountDetails = e;
        setBankAccountCredentails({ ...bankAccountCredentails });
    };

    const onNextButtonClick = (): void => {
        if(BasicDetailsComponentRef.current) {
            const updatedDetails = BasicDetailsComponentRef.current.getUpdatedBasicAccountDetails();
            onBasicAccountDetailsChange(updatedDetails);
        }
        setTab(tab < 3 ? tab + 1 : tab);
    }

    const onCreditCardListUpdate = (details: ICardDetails[]): void => {
        bankAccountCredentails.CreditCardDetails = details;
        setBankAccountCredentails({ ...bankAccountCredentails });
    };

    const onDebitCardListUpdate = (details: ICardDetails[]): void => {
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
                        {tab === 0 && <BasicDetailsComponent ref={BasicDetailsComponentRef} BasicAccountDetails={bankAccountCredentails.BasicAccountDetails}  />}
                        {tab === 1 && <AdditionalInfoListComponent additionalInfo={bankAccountCredentails.AdditionalInfo} onAdditionalInfoUpdate={onAdditionalInfoUpdate} />}
                        {tab === 2 && <CardDetailsComponent cardDetails={bankAccountCredentails.CreditCardDetails} onListUpdate={onCreditCardListUpdate} />}
                        {tab === 3 && <CardDetailsComponent cardDetails={bankAccountCredentails.DebitCardDetails} onListUpdate={onDebitCardListUpdate} />}
                    </Box>
                </Box>
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={() => props.onCancelAddBankAccountCredentials()} variant="contained" color="secondary">Cancel</Button>
                    <Button type="button" variant="contained" color="primary" disabled={tab === 0} onClick={() => setTab(tab - 1)}>Previous</Button>
                    {tab !== 3 ? (
                        <Button type="button" variant="contained" color="primary" onClick={onNextButtonClick}>Next</Button>
                    ) : (
                        <Button type="button" variant="contained" color="primary" onClick={onFormSubmit}>Submit</Button>
                    )}
                </Box>
            </form>
        </Paper>
    )
};

export default AddBankAccountCredentialsComponent;
