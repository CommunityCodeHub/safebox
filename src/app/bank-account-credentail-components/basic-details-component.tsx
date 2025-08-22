import { Box, Button, Grid, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import React from "react";
import { AccountType, IBasicAccountDetails } from "../../entities/db-entities/bank-account-credentails";

interface IBasicDetailsComponentProps {
    BasicAccountDetails: IBasicAccountDetails;
    onBasicAccountDetailsChange: (e: IBasicAccountDetails) => void;
    onCancelAddBankAccountCredentials: () => void;
    onNextButtonClick: () => void;

}

const BasicDetailsComponent: React.FC<IBasicDetailsComponentProps> = (props) => {
    const [showAccountTypeTextBox, setShowAccountTypeTextBox] = React.useState(false);
    const [basicAccountDetailsState, setBasicAccountDetailsState] = React.useState<IBasicAccountDetails>(props.BasicAccountDetails);

    React.useEffect(() => {
        setShowAccountTypeTextBox(basicAccountDetailsState.AccountType === 'Other');
    }, [basicAccountDetailsState.AccountType]);

    const onHtmlInputChange = (e: any) => {
        const propertyName = e.target.name;
        const value = e.target.value;
        var accountDetailsObject = basicAccountDetailsState as any;
        accountDetailsObject[propertyName] = value;
        setBasicAccountDetailsState({ ...accountDetailsObject });
    };

    const onNextButtonClick = (e: any) => {
        e.preventDefault();
        props.onBasicAccountDetailsChange(basicAccountDetailsState);
        props.onNextButtonClick();
    }

    const onAccountTypeDropdownValueChange = (e: any) => {
        var accountDetailsObject = basicAccountDetailsState as any;
        accountDetailsObject.AccountType = e.target.value;
        if (e.target.value !== 'Other') {
            accountDetailsObject.OtherAccountType = '';
            setShowAccountTypeTextBox(false);
        }
        setBasicAccountDetailsState({ ...accountDetailsObject });
    };

    return (
        <div>
            <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Main fields in two columns */}
                <Grid sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Bank Name</Typography>
                        <TextField
                            label="Bank Name"
                            name="BankName"
                            value={basicAccountDetailsState.BankName}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Account Holder Name</Typography>
                        <TextField
                            label="Account Holder Name"
                            name="AccountHolderName"
                            value={basicAccountDetailsState.AccountHolderName}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Account Type</Typography>
                        <Select
                            label="Account Type"
                            name="AccountType"
                            value={basicAccountDetailsState.AccountType}
                            onChange={ onAccountTypeDropdownValueChange}
                            required
                            size="small"
                            sx={{ flex: 1 }}
                            displayEmpty>
                            <MenuItem value=""><em>Select Account Type</em></MenuItem>
                            {Object.values(AccountType).map((type) => (
                                <MenuItem key={type} value={type} selected={basicAccountDetailsState.AccountType === type}>{type}</MenuItem>
                            ))}
                            <MenuItem key="Other" value="Other">Other</MenuItem>
                        </Select>
                        {((showAccountTypeTextBox)) && (
                            <TextField
                                label="Other Account Type"
                                name="OtherAccountType"
                                value={basicAccountDetailsState.OtherAccountType}
                                onChange={onHtmlInputChange}
                                required
                                size="small"
                                sx={{ flex: 1, ml: 2 }} />
                        )}
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Account Number</Typography>
                        <TextField
                            label="Account Number"
                            name="AccountNumber"
                            value={basicAccountDetailsState.AccountNumber}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Customer Id</Typography>
                        <TextField
                            label="Customer Id"
                            name="CustomerId"
                            value={basicAccountDetailsState.CustomerId}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                </Grid>
                <Grid sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Login Id</Typography>
                        <TextField
                            label="Login Id"
                            name="LoginId"
                            value={basicAccountDetailsState.LoginId}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Password</Typography>
                        <TextField
                            label="Password"
                            name="Password"
                            value={basicAccountDetailsState.Password}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Transaction Password</Typography>
                        <TextField
                            label="Transaction Password"
                            name="TransactionPassword"
                            value={basicAccountDetailsState.TransactionPassword}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Netbanking Url</Typography>
                        <TextField
                            label="NetbankingUrl"
                            name="NetbankingUrl"
                            value={basicAccountDetailsState.NetbankingUrl}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Telephone Banking PIN</Typography>
                        <TextField
                            label="Telephone Banking PIN"
                            name="TelephoneBankingPin"
                            value={basicAccountDetailsState.TelephoneBankingPin}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }} />
                    </Box>
                </Grid>

            </Grid><Box mt={3} display="flex" justifyContent="flex-end">
                <Button onClick={() => props.onCancelAddBankAccountCredentials()} sx={{ mr: 2 }}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" onClick={onNextButtonClick}>Next</Button>
            </Box>
        </div>

    )
}


export default BasicDetailsComponent;
