import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';

interface ApplicationCredentialsComponentProps {
    onAddAddtionalinfo: (key: string, value: string) => void;
    onClose: () => void;
}

const AddAddtionalInfoComponent: React.FC<ApplicationCredentialsComponentProps> = (props) => {

    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [keyError, setKeyError] = useState('');

    const validateKey = (val: string) => {
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(val)) {
            if (!/^[A-Za-z]/.test(val)) {
                return 'Key must start with an alphabet.';
            }
            if (/\s/.test(val)) {
                return 'Key cannot contain spaces.';
            }
            if (/[^A-Za-z0-9_]/.test(val)) {
                return 'Key cannot contain special characters.';
            }
            return 'Key must contain only letters, numbers, or underscores.';
        }
        return '';
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setKey(val);
        setKeyError(validateKey(val));
    };

    const onAddUpdateClick = (evt: any) => {
        if (keyError || !key) return;
        props.onAddAddtionalinfo(key, value);
        setKey('');
        setValue('');
        setKeyError('');
        props.onClose();
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', my: 12 }}>
            <Typography variant="h6" mb={2}>Add Additional Info</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Key"
                    value={key}
                    onChange={onKeyChange}
                    required
                    autoFocus
                    error={!!keyError}
                    helperText={keyError}
                />
                <TextField
                    label="Value"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                />
                <Box display="flex" justifyContent="flex-end" gap={1}>
                                        <Button
                                            type="button"
                                            onClick={props.onClose}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', background: '#f3f6fa', '&:hover': { background: '#e3f2fd', borderColor: 'primary.dark', color: 'primary.dark' } }}
                                        >
                                            Cancel
                                        </Button>
                    <Button type="button" onClick={onAddUpdateClick} variant="contained" color="primary" disabled={!!keyError || !key}>Add</Button>
                </Box>
            </Box>
        </Paper>

    );
};

export default AddAddtionalInfoComponent;