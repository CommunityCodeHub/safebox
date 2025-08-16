// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  registerUser: (username: string, password: string, workspacePath: string) =>
    ipcRenderer.invoke('register-user', { username, password, workspacePath }),
  readUserFile: (username: string, password: string, workspacePath: string) =>
    ipcRenderer.invoke('read-user-file', { username, password, workspacePath }),
  readBankAccountFile: (workspacePath: string) =>
    ipcRenderer.invoke('read-bank-account-file', { workspacePath }),
  writeBankAccountFile: (workspacePath: string, data: any) =>
    ipcRenderer.invoke('write-bank-account-file', { workspacePath, data }),
  writeApplicationCredentialsFile: (workspacePath: string, data: any) =>
    ipcRenderer.invoke('write-application-credentials-file', { workspacePath, data }),
  readApplicationCredentialsFile: (workspacePath: string) =>
    ipcRenderer.invoke('read-application-credentials-file', { workspacePath }),
  
});


contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  customMethod: () => ipcRenderer.invoke('custom-method'),
}); 

