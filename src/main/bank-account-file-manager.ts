import { ipcMain, safeStorage } from 'electron';
import { StrongCrypto } from '../cryptography/cryptoUtils';
import fs from 'fs';
import path from 'path';
import { ApplicationConstants } from '../entities/application.constants';
import { AppLogger } from './app-logger';


ipcMain.handle('read-bank-account-credentials-file', async (_event, { workspacePath, encryptionKey }) => {
  try {
    
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.BANK_ACCOUNT_CREDENTIALS_FILE);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'BankAccount file not found.' };
    }
    if (!encryptionKey) {
      return { success: false, error: 'Encryption key is required.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const encryptedPayload = JSON.parse(fileContent);
    const crypto = new StrongCrypto(encryptionKey);
    const decrypted = crypto.decrypt(
      encryptedPayload.cipherText,
      encryptedPayload.iv,
      encryptedPayload.tag
    );
    return { fileContent: JSON.parse(decrypted), success: true, valid: true };
  } catch (err) {
  AppLogger.getInstance().error('read-bank-account-credentials-file: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('read-application-credentials-file', async (_event, { workspacePath, encryptionKey }) => {
  try {
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.APPLICATION_CREDENTIALS_FILE);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'ApplicationCredentials file not found.' };
    }
    if (!encryptionKey) {
      return { success: false, error: 'Encryption key is required.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const encryptedPayload = JSON.parse(fileContent);
    const crypto = new StrongCrypto(encryptionKey);
    const decrypted = crypto.decrypt(
      encryptedPayload.cipherText,
      encryptedPayload.iv,
      encryptedPayload.tag
    );
    return { fileContent: JSON.parse(decrypted), success: true, valid: true };
  } catch (err) {
  AppLogger.getInstance().error('read-application-credentials-file: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('write-bank-account-credentials-file', async (_event, { workspacePath, data, encryptionKey }) => {
  try {
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.BANK_ACCOUNT_CREDENTIALS_FILE);
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }
    const crypto = new StrongCrypto(encryptionKey);
    const plainText = JSON.stringify(data);
    const encrypted = crypto.encrypt(plainText);
    // Store all parts needed for decryption
    const encryptedPayload = JSON.stringify({
      cipherText: encrypted.cipherText,
      iv: encrypted.iv,
      tag: encrypted.tag
    });
    fs.writeFileSync(filePath, encryptedPayload, 'utf-8');
    return { success: true };
  } catch (err) {
  AppLogger.getInstance().error('write-bank-account-credentials-file: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('write-application-credentials-file', async (_event, { workspacePath, data, encryptionKey }) => {
  try {
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.APPLICATION_CREDENTIALS_FILE);
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }
    const crypto = new StrongCrypto(encryptionKey);
    const plainText = JSON.stringify(data);
    const encrypted = crypto.encrypt(plainText);
    // Store all parts needed for decryption
    const encryptedPayload = JSON.stringify({
      cipherText: encrypted.cipherText,
      iv: encrypted.iv,
      tag: encrypted.tag
    });
    fs.writeFileSync(filePath, encryptedPayload, 'utf-8');
    return { success: true };
  } catch (err) {
  AppLogger.getInstance().error('write-application-credentials-file: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});
