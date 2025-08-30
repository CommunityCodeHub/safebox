import { dialog } from 'electron';
import { ipcMain } from 'electron';
import { AppLogger } from './app-logger';


async function openFolderBrowserDialog(): Promise<string | undefined> {
    
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
    
        const selectedFolderPath = result.filePaths[0];
        // Now you have the path to the selected folder, you can proceed to read its contents
        console.log('Selected folder:', selectedFolderPath);
        return selectedFolderPath;
    }
    return null;
}

ipcMain.handle('show-directory-browser', async (_event) => {
    try {
        const folderPath = await openFolderBrowserDialog();
        if (folderPath) {
            return { success: true, folderPath };
        } else {
            return { success: false, error: 'No folder selected.' };
        }
    } catch (err) {
        AppLogger.getInstance().error('show-directory-browser: ' + (err instanceof Error ? err.message : String(err)));
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
});
