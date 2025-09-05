import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';
import { IUserSettings } from '../../entities/db-entities/user-settings';
import { ApplicationConstants } from '../../entities/application.constants';

interface LoginProps {
  onLoginComplete(userSettings: IUserSettings): void;
}



const Login: React.FC<LoginProps> = ( props ) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [userSettings, setUserSettings] = React.useState<IUserSettings | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);


  const ReadUserSettingsFile = async (username: string): Promise<IUserSettings | undefined> => {
    if (!window.api || typeof window.api.readUserSettingsFile !== 'function') {
      setLocalError('Read user settings file API not available.');
      return;
    }
    const result = await window.api.readUserSettingsFile(username);

    if (result.success) {
      setUserSettings(result.data);

      return result.data;
    }

    if (result.error == ApplicationConstants.Messages.USER_SETTINGS_FILE_NOT_FOUND) {
      const result = await window.api.showConfirm("Confirm Registration", "It looks like your account is not yet registered for this application on this device. If you’ve already registered on some another device, please use the same UserName, Workspace Folder (Cloud Folder) and Encryption Key to register your account here as well.", "warning");
      if (result.response === 0) { // Ok
        navigate("/register");
        return;
      }
    }
    if (result.error == ApplicationConstants.Messages.FAILED_TO_READ_USER_SETTINGS_FILE) {
      window.api.showAlert('Configuration Error', 'Failed to read user settings file. Please check application logs for details.', 'error');
    }
  }

const handleLogin = async (username: string, password: string) => {
		setLocalError(undefined);
		const userSettings = await ReadUserSettingsFile(username);
		if (!userSettings) {
			setLocalError('Incorrect username or account not registered. Please register your account by clicking Register Button on this page.');
			return;
		}

		if (password !== userSettings.Password) {
			setLocalError('Incorrect password.');
      return; 
		}
		setIsUserLoggedIn(true);
		sessionStorage.setItem('IsLoggedIn', 'true');
		sessionStorage.setItem('LastLoggedInTime', new Date().getTime().toString());
		sessionStorage.setItem('UserName', username);
    props.onLoginComplete(userSettings); 
	};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLocalError('Please enter username and password.');
      return;
    }
    setLocalError(null);
    handleLogin(username, password);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ minWidth: 320, maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }}>
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mb: 1, fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', background: '#f3f6fa', '&:hover': { background: '#e3f2fd', borderColor: 'primary.dark', color: 'primary.dark' } }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            {(localError) && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {localError}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
