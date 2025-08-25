import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import { useUserSettings } from '../services/user-settings-context';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

interface SettingsComponentProps {
  onClose: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = (props) => {

  const userSettings = useUserSettings();
  const [workspacePath, setWorkspacePath] = useState(userSettings.WorkspacePath || '');
  const [encryptionKey, setEncryptionKey] = useState(userSettings.EncryptionKey || '');
  const [error, setError] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = React.useState(false);
  const handleSave = () => {
    if (!workspacePath.trim()) {
      setError('Workspace folder path is required.');
      return;
    }
    if (!encryptionKey.trim()) {
      setError('Encryption key is required.');
      return;
    }
    setError('');


    props.onClose();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, margin: '32px auto' }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <TextField
        label="Workspace Folder Path"
        name="WorkspacePath"
        value={workspacePath}
        onChange={e => setWorkspacePath(e.target.value)}
        fullWidth
        margin="normal"
        size="small"
        sx={{ flex: 1 }}
        required
      />

      <TextField
        label="Encryption Key"
        name="EncryptionKey"
        type={showEncryptionKey ? 'text' : 'password'}
        value={encryptionKey}
        onChange={e => setEncryptionKey(e.target.value)}
        required
        fullWidth
        margin='normal'
        size="small"
        sx={{ flex: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowEncryptionKey((show) => !show)}
                edge="end"
              >
                {showEncryptionKey ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button sx={{ mr: 2 }} onClick={props.onClose}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsComponent;
