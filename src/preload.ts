// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import registerLoginFunctions from './login'
 // Ensure login functionality is available in the preload context

 document.addEventListener('DOMContentLoaded', () => {
    registerLoginFunctions();
 }); 


contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  customMethod: () => ipcRenderer.invoke('custom-method'),
}); 

