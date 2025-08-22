import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Paper, TextField } from '@mui/material';

interface ApplicationCredentialsComponentProps {
    onAddAddtionalinfo: (key: string, value: string) => void;
    onClose: () => void;
}

const AddAddtionalInfoComponent: React.FC<ApplicationCredentialsComponentProps> = (props) => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    

    const onAddUpdateClick = (evt:any) => {
        props.onAddAddtionalinfo(key, value);
        setKey('');
        setValue('');
        props.onClose();
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', my: 12 }}>
            <Typography variant="h6" mb={2}>Add Additional Info</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Key"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    required
                    autoFocus
                />
                <TextField
                    label="Value"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                />
                <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button type="button" onClick={props.onClose}>Cancel</Button>
                    <Button type="button" onClick={onAddUpdateClick}>Add</Button>
                </Box>
            </Box>
        </Paper>

    );
};

export default AddAddtionalInfoComponent;