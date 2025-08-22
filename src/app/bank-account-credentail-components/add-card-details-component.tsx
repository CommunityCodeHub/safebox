import { Grid, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { ICardDetails } from "../../entities/db-entities/bank-account-credentails";
import React from "react";

interface IAddCardDetailsComponentProps {
    onAddCardDetails: (details: ICardDetails) => void;
    cardDetails: ICardDetails | null;
    onClose: () => void;
}

const AddCardDetailsComponent: React.FC<IAddCardDetailsComponentProps> = (props) => {
    const defaultCardDetails: ICardDetails = {
        CardName: '',
        CardNumber: '',
        CardHolderName: '',
        ExpiryDate: '',
        CVV: '',
        IssuingBank: '',
        Pin: '',
        CreatedOn: new Date(),
        LastUpdatedOn: new Date(),
        AdditionalInfo: {},
    };
    const [cardDetailsObject, setCardDetailsObject] = React.useState<ICardDetails | null>(props.cardDetails || defaultCardDetails);
    const onHtmlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetailsObject((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const onSaveCardDetails = (e: any) => {
        e.preventDefault();
        props.onAddCardDetails(cardDetailsObject);
        props.onClose();
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', my: 4 }}>
            <Typography variant="h6" mb={2}>Add Credit Card Details</Typography>
            <Grid container spacing={2}>
                <Grid>
                    <TextField
                        label="Card Name"
                        name="CardName"
                        value={cardDetailsObject.CardName}
                        onChange={onHtmlInputChange}
                        required
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Card Holder Name"
                        name="CardHolderName"
                        value={cardDetailsObject.CardHolderName}
                        onChange={onHtmlInputChange}
                        required
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Card Number"
                        name="CardNumber"
                        value={cardDetailsObject.CardNumber}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, '');
                            // Amex: 15 digits, format 4-6-5
                            if (/^3[47]/.test(value)) {
                                if (value.length > 15) value = value.slice(0, 15);
                                value = value.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (m, g1, g2, g3) =>
                                    g3 ? `${g1} ${g2} ${g3}` : g2 ? `${g1} ${g2}` : g1
                                );
                            } else {
                                // Other cards: 16 digits, format 4-4-4-4
                                if (value.length > 16) value = value.slice(0, 16);
                                value = value.replace(/(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})/, (m, g1, g2, g3, g4) =>
                                    [g1, g2, g3, g4].filter(Boolean).join(' ')
                                );
                            }
                            setCardDetailsObject((prev) => (prev ? { ...prev, CardNumber: value } : null));
                        }}
                        required
                        fullWidth
                        size="small"
                        placeholder="1234 5678 9012 3456"
                        inputProps={{ maxLength: 19 }}
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Expiry Date (MM/YYYY)"
                        name="ExpiryDate"
                        placeholder="MM/YYYY"
                        value={cardDetailsObject.ExpiryDate}
                        onChange={(e) => {
                            // Only allow MM/YYYY format
                            let value = e.target.value;
                            // Remove non-digits except '/'
                            value = value.replace(/[^\d/]/g, '');
                            // Add slash after 2 digits if not present
                            if (value.length === 2 && !value.includes('/')) {
                                value = value + '/';
                            }
                            // Limit to 7 chars (MM/YYYY)
                            if (value.length > 7) value = value.slice(0, 7);
                            setCardDetailsObject((prev) => (prev ? { ...prev, ExpiryDate: value } : null));
                        }}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: 7 }}
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="CVV"
                        name="CVV"
                        value={cardDetailsObject.CVV}
                        onChange={onHtmlInputChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: 4 }}
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="Issuing Bank"
                        name="IssuingBank"
                        value={cardDetailsObject.IssuingBank}
                        onChange={onHtmlInputChange}
                        required
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid>
                    <TextField
                        label="PIN"
                        name="Pin"
                        type="number"
                        value={cardDetailsObject.Pin}
                        onChange={onHtmlInputChange}
                        required
                        fullWidth
                        size="small"
                    />
                </Grid>
                {/* AdditionalInfo can be handled with a custom component if needed */}
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button type="button" variant="contained" color="primary" onClick={onSaveCardDetails}>Save</Button>
            </Box>

        </Paper>
    );
}

export default AddCardDetailsComponent;