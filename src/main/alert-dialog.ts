import { dialog, ipcMain, safeStorage } from 'electron';

ipcMain.handle('show-renderer-alert', async (_event, { title, message, type }) => {
  const options: Electron.MessageBoxOptions = {
    type: type,
    buttons: ['OK'],
    title: title,
    message: message
  };
  const result = await dialog.showMessageBox(options);
  
  return { response: result.response };
});

ipcMain.handle('show-renderer-confirm', async (_event, { title, message, type }) => {
  const options: Electron.MessageBoxOptions = {
    type: type,
    buttons: ['OK', 'Cancel'],
    title: title,
    message: message
  };
  const result = await dialog.showMessageBox(options);
  console.log('Confirmation dialog result:', result);
  return { response: result.response };
});