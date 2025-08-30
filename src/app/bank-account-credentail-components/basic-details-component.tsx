import { Box, Grid, MenuItem, Select, TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from "react";
import { AccountType, IBasicAccountDetails } from "../../entities/db-entities/bank-account-credentails";

interface IBasicDetailsComponentProps {
    BasicAccountDetails: IBasicAccountDetails;
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
            <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' }, width: '100%', paddingTop: 2 }}>
                {/* Main fields in two columns */}
                <Grid sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
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

        </div>

    )
});

export default BasicDetailsComponent;
