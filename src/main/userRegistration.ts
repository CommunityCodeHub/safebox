import { ipcMain, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import { StrongCrypto } from '../cryptography/cryptoUtils';
import { Password, Work } from '@mui/icons-material';

// Register the IPC handler for user registration
ipcMain.handle('register-user', async (_event, { username, password, workspacePath }) => {
  try {
    // Use password as encryption key for demo; in production, use a better key derivation
    
    const crypto = new StrongCrypto(password);
    //const data = JSON.stringify({ username, password, workspacePath });
    const data = password; 
    if (!safeStorage.isEncryptionAvailable()){
        alert("Encryption is not available");
    }
    const encryptedPassword = safeStorage.encryptString(password); //crypto.encrypt(data);
    
    const out = {
      UserName: username, 
      Password: encryptedPassword.toString('base64'), // Convert to base64 string for storage
      WorkspacePath: workspacePath,
    };
    const fileName = `${username}-login.json`;
    const filePath = path.join(workspacePath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf-8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});
