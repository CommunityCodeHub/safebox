// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';
import { IUserSettings } from './entities/db-entities/user-settings';

contextBridge.exposeInMainWorld('api', {
  // Logging methods
  setLogLevel: (level: string) =>
    ipcRenderer.invoke('set-log-level', { level }),
  logMessage: (level: string, message: string) =>
    ipcRenderer.invoke('log-message', { level, message }),
  logError: (message: string) =>
    ipcRenderer.invoke('log-error', { message }),
  logTrace: (message: string) =>
    ipcRenderer.invoke('log-trace', { message }),
  logMetric: (message: string) =>
    ipcRenderer.invoke('log-metric', { message }),
  registerUser: (username: string, password: string, workspacePath: string) =>
    ipcRenderer.invoke('register-user', { username, password, workspacePath }),
  readUserFile: (username: string, password: string, workspacePath: string) =>
    ipcRenderer.invoke('read-user-file', { username, password, workspacePath }),
  readBankAccountCredentialsFile: (workspacePath: string, encryptionKey: string) =>
    ipcRenderer.invoke('read-bank-account-credentials-file', { workspacePath, encryptionKey }),
  writeBankAccountCredentialsFile: (workspacePath: string, data: any, encryptionKey: string) =>
    ipcRenderer.invoke('write-bank-account-credentials-file', { workspacePath, data, encryptionKey }),
  writeApplicationCredentialsFile: (workspacePath: string, data: any, encryptionKey: string) =>
    ipcRenderer.invoke('write-application-credentials-file', { workspacePath, data, encryptionKey }),
  readApplicationCredentialsFile: (workspacePath: string, encryptionKey: string) =>
    ipcRenderer.invoke('read-application-credentials-file', { workspacePath, encryptionKey }),
  openExternal: (url: string) =>
    ipcRenderer.invoke('open-external', { url }),

  readUserSettingsFile: (username: string) =>
    ipcRenderer.invoke('read-user-settings-file', { username }),
  writeUserSettingsFile: (data: IUserSettings) =>
    ipcRenderer.invoke('write-user-settings-file', { data }),

  // Notes methods
  writeNotePage: (workspacePath: string, pageTitle: string, content: string, encryptionKey: string) =>
    ipcRenderer.invoke('write-note-page', { workspacePath, pageTitle, content, encryptionKey }),
  readNotePage: (workspacePath: string, pageTitle: string, encryptionKey: string) =>
    ipcRenderer.invoke('read-note-page', { workspacePath, pageTitle, encryptionKey }),
  listNotePages: (workspacePath: string) =>
    ipcRenderer.invoke('list-note-pages', { workspacePath }),
  showDirectoryBrowser: (): Promise<string | undefined> =>
    ipcRenderer.invoke('show-directory-browser'),
  isValidEncryptionKey: (encryptionKey: string, workspacePath: string, username: string): Promise<any> =>
    ipcRenderer.invoke('is-valid-encryption-key', { encryptionKey, workspacePath, username }),

});



