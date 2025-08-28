import { ipcMain } from 'electron';
import { StrongCrypto } from '../cryptography/cryptoUtils';
import fs from 'fs';
import path from 'path';

import { ApplicationConstants } from '../entities/application.constants';
import { AppLogger } from './app-logger';

// Save a note page (encrypted)
ipcMain.handle('write-note-page', async (_event, { workspacePath, pageTitle, content, encryptionKey }) => {
  try {
    if (!encryptionKey) throw new Error('Encryption key is required');
    if (!pageTitle) throw new Error('Page title is required');
    const fileName = `${pageTitle}.note`;
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.NOTES_FOLDER_NAME, fileName);
    const crypto = new StrongCrypto(encryptionKey);
    const encrypted = crypto.encrypt(content);
    const encryptedPayload = JSON.stringify({
      cipherText: encrypted.cipherText,
      iv: encrypted.iv,
      tag: encrypted.tag
    });
    fs.writeFileSync(filePath, encryptedPayload, 'utf-8');
  AppLogger.getInstance().info(`Note page saved: ${filePath}`);

    return { success: true };
  } catch (err) {
  AppLogger.getInstance().error('write-note-page: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

// Read a note page (decrypt)
ipcMain.handle('read-note-page', async (_event, { workspacePath, pageTitle, encryptionKey }) => {
  try {
    if (!encryptionKey) throw new Error('Encryption key is required');
    if (!pageTitle) throw new Error('Page title is required');
    const fileName = `${pageTitle}.note`;
    const filePath = path.join(workspacePath, ApplicationConstants.FileNames.NOTES_FOLDER_NAME, fileName);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Note file not found.' };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const encryptedPayload = JSON.parse(fileContent);
    const crypto = new StrongCrypto(encryptionKey);
    const decrypted = crypto.decrypt(
      encryptedPayload.cipherText,
      encryptedPayload.iv,
      encryptedPayload.tag
    );
    return { content: decrypted, success: true };
  } catch (err) {
  AppLogger.getInstance().error('read-note-page: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

// List all note pages in the workspace
ipcMain.handle('list-note-pages', async (_event, { workspacePath }) => {
  try {
    const notesFolderPath = path.join(workspacePath, ApplicationConstants.FileNames.NOTES_FOLDER_NAME);
    const files = fs.readdirSync(notesFolderPath);
    const noteFiles = files.filter(f => f.endsWith('.note'));
    // Remove .note extension for page titles
    const pageTitles = noteFiles.map(f => f.replace(/\.note$/, ''));
    return { pages: pageTitles, success: true };
  } catch (err) {
  AppLogger.getInstance().error('list-note-pages: ' + (err instanceof Error ? err.message : String(err)));
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});
