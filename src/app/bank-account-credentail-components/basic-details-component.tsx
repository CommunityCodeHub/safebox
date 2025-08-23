import { Box, Button, Grid, MenuItem, Modal, Select, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from "react";
import { AccountType, IBasicAccountDetails } from "../../entities/db-entities/bank-account-credentails";

interface IBasicDetailsComponentProps {
    BasicAccountDetails: IBasicAccountDetails;
    //onBasicAccountDetailsChange: (e: IBasicAccountDetails) => void;
    //onCancelAddBankAccountCredentials: () => void;
    //onNextButtonClick: () => void;

}

export interface BasicDetailsComponentHandle {
    getUpdatedBasicAccountDetails: () => IBasicAccountDetails;
}

const BasicDetailsComponent = React.forwardRef<BasicDetailsComponentHandle, IBasicDetailsComponentProps>((props, ref) => {
    const [showAccountTypeTextBox, setShowAccountTypeTextBox] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showTransactionPassword, setShowTransactionPassword] = React.useState(false);
    const [basicAccountDetailsState, setBasicAccountDetailsState] = React.useState<IBasicAccountDetails>(props.BasicAccountDetails);

    React.useEffect(() => {
        setShowAccountTypeTextBox(basicAccountDetailsState.AccountType === 'Other');
    }, [basicAccountDetailsState.AccountType]);

    const [netbankingUrlError, setNetbankingUrlError] = React.useState('');
    const validateUrl = (url: string) => {
        // Simple URL validation
        try {
            if (!url) return '';
            new URL(url);
            return '';
        } catch {
            return 'Enter a valid URL (e.g. https://example.com)';
        }
    };

    const onHtmlInputChange = (e: any) => {
        const propertyName = e.target.name;
        let value = e.target.value;
        if (propertyName === 'AccountNumber') {
            value = value.replace(/[^\d]/g, '');
        }
        if (propertyName === 'CustomerId') {
            value = value.replace(/[^a-zA-Z0-9]/g, '');
        }
        if (propertyName === 'NetbankingUrl') {
            setNetbankingUrlError(validateUrl(value));
        }
        if (propertyName === 'TelephoneBankingPin') {
            value = value.replace(/[^\d]/g, '');
        }
        var accountDetailsObject = basicAccountDetailsState as any;
        accountDetailsObject[propertyName] = value;
        setBasicAccountDetailsState({ ...accountDetailsObject });
    };

    const getUpdatedBasicAccountDetails = () => {
        return { ...basicAccountDetailsState };
    };

    React.useImperativeHandle(ref, () => ({
        getUpdatedBasicAccountDetails: getUpdatedBasicAccountDetails
    }));

    // const onNextButtonClick = (e: any) => {
    //     e.preventDefault();
    //     props.onBasicAccountDetailsChange(basicAccountDetailsState);
    //     props.onNextButtonClick();
    // }

    const onAccountTypeDropdownValueChange = (e: any) => {
        var accountDetailsObject = basicAccountDetailsState as any;
        accountDetailsObject.AccountType = e.target.value;
        if (e.target.value !== 'Other') {
            accountDetailsObject.OtherAccountType = '';
            setShowAccountTypeTextBox(false);
        } else {
            setShowAccountTypeTextBox(true);
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
                            sx={{ flex: 1 }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
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
                            sx={{ flex: 1 }}
                            inputProps={{ inputMode: 'text', pattern: '[a-zA-Z0-9]*' }}
                        />
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
                            type={showPassword ? 'text' : 'password'}
                            value={basicAccountDetailsState.Password}
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
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" sx={{ minWidth: 140, mr: 2 }}>Transaction Password</Typography>
                        <TextField
                            label="Transaction Password"
                            name="TransactionPassword"
                            type={showTransactionPassword ? 'text' : 'password'}
                            value={basicAccountDetailsState.TransactionPassword}
                            onChange={onHtmlInputChange}
                            required
                            size="small"
                            sx={{ flex: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle transaction password visibility"
                                            onClick={() => setShowTransactionPassword((show) => !show)}
                                            edge="end"
                                        >
                                            {showTransactionPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
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
                            sx={{ flex: 1 }}
                            error={!!netbankingUrlError}
                            helperText={netbankingUrlError}
                        />
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
                            sx={{ flex: 1 }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    </Box>
                </Grid>

            </Grid>
            {/* <Box mt={3} display="flex" justifyContent="flex-end">
                <Button onClick={() => props.onCancelAddBankAccountCredentials()} sx={{ mr: 2 }}>Cancel</Button>
                <Button type="button" variant="contained" color="primary" onClick={onNextButtonClick}>Next</Button>
            </Box> */}
        </div>

    )
});

export default BasicDetailsComponent;
