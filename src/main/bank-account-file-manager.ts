import { ipcMain, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';

const bankAccountFileName = 'H0DTaUDYeyXGBEdah2RVHxynhhJJLJ';
//const applicationCredentailsFileName = "CLvKUfVgJGZafTkuQTLmikuQuFDzFk";
const applicationCredentailsFileName = "appcredentials.json";

ipcMain.handle('read-bank-account-credentials-file', async (_event, { workspacePath }) => {
  try {
    
    const filePath = path.join(workspacePath, bankAccountFileName);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'BankAccount file not found.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    //const fileDataJson = safeStorage.decryptString(Buffer.from(fileContent, 'base64'));
    const fileDataJson = fileContent; 
    return {fileContent: JSON.parse(fileDataJson), success: true, valid: true };

  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('read-application-credentials-file', async (_event, { workspacePath }) => {
  try {

    const filePath = path.join(workspacePath, applicationCredentailsFileName);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'ApplicationCredentials file not found.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    //const fileDataJson = safeStorage.decryptString(Buffer.from(fileContent, 'base64'));
    const fileDataJson = fileContent; 
    return {fileContent: JSON.parse(fileDataJson), success: true, valid: true };

  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('write-bank-account-credentials-file', async (_event, { workspacePath, data }) => {
    try {
        const filePath = path.join(workspacePath, bankAccountFileName);
        //const encryptedData = safeStorage.encryptString(JSON.stringify(data)).toString('base64');
        const encryptedData = JSON.stringify(data);
        fs.writeFileSync(filePath, encryptedData, 'utf-8');

        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
});

ipcMain.handle('write-application-credentials-file', async (_event, { workspacePath, data }) => {
    try {
        const filePath = path.join(workspacePath, applicationCredentailsFileName);
        //const encryptedData = safeStorage.encryptString(JSON.stringify(data)).toString('base64');
        const encryptedData = JSON.stringify(data); // For demo purposes, not encrypting
        fs.writeFileSync(filePath, encryptedData, 'utf-8');

        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
});
