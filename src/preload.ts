// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';
import { IUserSettings } from './entities/db-entities/user-settings';

contextBridge.exposeInMainWorld('api', {
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

});


contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  customMethod: () => ipcRenderer.invoke('custom-method'),
}); 

