import React,  { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useUserSettings } from '../services/user-settings-context';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
interface SettingsComponentProps {
  
}

const SettingsComponent: React.FC<SettingsComponentProps> = (props) => {

  const userSettings = useUserSettings();
  const [workspacePath, setWorkspacePath] = useState(userSettings.WorkspacePath || '');
  const [encryptionKey, setEncryptionKey] = useState(userSettings.EncryptionKey || '');
  const [error, setError] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = React.useState(false);
  const navigate = useNavigate();
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


    navigate('app/dashboard'); 
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Copy to clipboard">
                <IconButton
                  aria-label="copy workspace path"
                  onClick={() => {
                    navigator.clipboard.writeText(workspacePath);
                  }}
                  edge="end"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
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
              <Tooltip title="View Encryption Key.">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowEncryptionKey((show) => !show)}
                  edge="end"
                >
                  {showEncryptionKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to clipboard">
                <IconButton
                  aria-label="copy encryption key"
                  onClick={() => {
                    navigator.clipboard.writeText(encryptionKey);
                  }}
                  edge="end"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

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
        <Button variant="contained" color="primary" onClick={() => navigate('app/dashboard')}>
          Close
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsComponent;
