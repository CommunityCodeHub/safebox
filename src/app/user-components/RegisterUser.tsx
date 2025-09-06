
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, InputAdornment, IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { v4 as uuidv4 } from 'uuid';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { IUserSettings } from '../../entities/db-entities/user-settings';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string; // Include 'directory' as well for broader compatibility
  }
}

interface RegisterUserProps {

}

function isStrongPassword(password: string): boolean {
  // Minimum 8 characters, at least 1 uppercase, 1 number, 1 special character
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

const registerUserAccount = async (username: string, password: string, workspacePath: string, encryptionKey: string, navigate: (path: string) => void) => {
  if (window.api && typeof window.api.registerUser === 'function') {
    var userSettings: IUserSettings = {
      UserName: username,
      Password: password,
      WorkspacePath: workspacePath,
      EncryptionKey: encryptionKey
    }

    const result = await window.api.writeUserSettingsFile(userSettings);
    if (result.success) {
      await window.api.showAlert('Registration Successful', 'User Registration successful!. Please login to proceed.', 'info');
      navigate('/login');
    } else {
      await window.api.showAlert('Registration Failed', `Registration failed: ${result.error}`, 'error');
    }
  } else {
    await window.api.logError("Registration API Not Available");
    window.api.showAlert('Unhandled Exception', 'Some unknown error occured while registering user. Please check application logs for details.', 'error');
  }
};

const RegisterUser: React.FC<RegisterUserProps> = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [workspacePath, setWorkspacePath] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !workspacePath || !encryptionKey) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters, include one uppercase letter, one number, and one special character.');
      return;
    }

    const isUserAlreadyRegistered = await isUserRegistered(username);
    if (isUserAlreadyRegistered) {
      setError('User is already registered.');
      return;
    }

    var isValid = await isValidEncryptionKey(encryptionKey, workspacePath, username);
    if (!isValid) {
      return;
    }

    setError(null);
  registerUserAccount(username, password, workspacePath, encryptionKey, navigate);
  };

  const isValidEncryptionKey = async (encryptionKey: string, workspacePath: string, username: string): Promise<boolean> => {
    if (!window.api || typeof window.api.isValidEncryptionKey !== 'function') {
      setError('Encryption key validation API not available.');
      return false;
    }
    const result = await window.api.isValidEncryptionKey(encryptionKey, workspacePath, username);
    if (result.success) {
      return true;
    }

    setError(result.error);
    return false;
  }


  const isUserRegistered = async (username: string): Promise<boolean> => {
    if (!window.api || typeof window.api.readUserSettingsFile !== 'function') {
      setError('User registration API not available.');
      return false;
    }
    const result = await window.api.readUserSettingsFile(username);
    if (result.success) {
      return true;
    }

    setError(result.error);
    return false;
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ minWidth: 370, maxWidth: 450, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Register User
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enter a unique username for your account.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Password must be at least 8 characters, include one uppercase letter, one number, and one special character.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Re-enter your password to confirm.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Workspace Folder Path"
              variant="outlined"
              fullWidth
              margin="normal"
              value={workspacePath}
              onChange={e => setWorkspacePath(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="The folder where your encrypted data files will be saved. Ideally, choose or create a folder within a cloud storage service such as OneDrive or Google Drive that is synced with your computer. This helps ensure your data remains safe and accessible even if something happens to your computer.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      aria-label="browse folder"
                      onClick={async () => {
                        const result: any = await window.api.showDirectoryBrowser();
                        if (result.success) {
                          setWorkspacePath(result.folderPath);
                        }
                      }}
                      edge="end"
                    >
                      <FolderOpenIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Encryption Key"
              type={showEncryptionKey ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={encryptionKey}
              onChange={e => setEncryptionKey(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="This secret key is used to encrypt and decrypt your data. If you are accessing the same cloud storage folder from another computer, make sure to use the same encryption key on this device to maintain compatibility and access your data securely.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate Encryption Key">
                      <IconButton
                        aria-label="generate encryption key"
                        onClick={() => setEncryptionKey(uuidv4())}
                        edge="end"
                      >
                        <AutorenewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Show Encryption Key">
                      <IconButton
                        aria-label="Show Encryption Key"
                        onClick={() => setShowEncryptionKey((show) => !show)}
                        edge="end"
                      >
                        {showEncryptionKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              webkitdirectory="true"
              directory="true"
              onChange={e => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // Get the folder path from the first file
                  const path = (files[0] as any).webkitRelativePath?.split('/')[0] || '';
                  setWorkspacePath(path);
                }
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 1 }}>
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mb: 1, fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', background: '#f3f6fa', '&:hover': { background: '#e3f2fd', borderColor: 'primary.dark', color: 'primary.dark' } }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterUser;


