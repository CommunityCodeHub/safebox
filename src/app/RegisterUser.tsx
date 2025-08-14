
import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string; // Include 'directory' as well for broader compatibility
  }
}

interface RegisterUserProps {
  onRegister: (username: string, password: string, workspacePath: string) => void;
  onBackToLogin: () => void;
}

function isStrongPassword(password: string): boolean {
  // Minimum 8 characters, at least 1 uppercase, 1 number, 1 special character
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

const RegisterUser: React.FC<RegisterUserProps> = ({ onRegister, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [workspacePath, setWorkspacePath] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !workspacePath) {
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
    setError(null);
    onRegister(username, password, workspacePath);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ minWidth: 320, maxWidth: 400, width: '100%', boxShadow: 3 }}>
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
                    <IconButton
                      aria-label="browse folder"
                      onClick={() => fileInputRef.current?.click()}
                      edge="end"
                    >
                      <FolderOpenIcon />
                    </IconButton>
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
            <Button variant="text" color="secondary" fullWidth sx={{ mb: 1 }} onClick={onBackToLogin}>
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


