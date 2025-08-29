import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputAdornment, IconButton, Tooltip, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useUserSettings } from '../services/user-settings-context';

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

function isStrongPassword(password: string): boolean {
  // Minimum 8 characters, at least 1 uppercase, 1 number, 1 special character
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ open, onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userSettings = useUserSettings();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!isValidCurrentPassword(currentPassword)) {
      setError('Current password is incorrect.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password must be different from current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError('Password must be at least 8 characters, include one uppercase letter, one number, and one special character.');
      return;
    }
    setError(null);
    var updatedUserSettings = { ...userSettings, Password: newPassword };

    const result = await window.api.writeUserSettingsFile(updatedUserSettings);

    if (result.success) {
       alert(`Password updated successfully.`);
        onClose(); 
    } else {
        alert(`Failed to update password: ${result.error}`);
    }
  };

  const isValidCurrentPassword = (password: string) => {
    // Implement your logic to validate the current password
    return userSettings.Password === password;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Enter your current password.">
                    <IconButton tabIndex={-1} edge="end">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    aria-label="Show Current Password"
                    onClick={() => setShowCurrent(show => !show)}
                    edge="end"
                  >
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showNew ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Password must be at least 8 characters, include one uppercase letter, one number, and one special character.">
                    <IconButton tabIndex={-1} edge="end">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    aria-label="Show New Password"
                    onClick={() => setShowNew(show => !show)}
                    edge="end"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Re-enter your new password to confirm.">
                    <IconButton tabIndex={-1} edge="end">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    aria-label="Show Confirm Password"
                    onClick={() => setShowConfirm(show => !show)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Change Password</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePassword;
