import { ipcMain, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';

ipcMain.handle('read-user-file', async (_event, { username, password, workspacePath }) => {
  try {
    const fileName = `${username}-login.json`;
    const filePath = path.join(workspacePath, fileName);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'User file not found.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { UserName, Password, WorkspacePath } = JSON.parse(fileContent);
    const decryptedPassword = safeStorage.decryptString(Buffer.from(Password, 'base64'));
    
    if (decryptedPassword=== password) {
      return { success: true, valid: true };
    } else {
      return { success: true, valid: false };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});
