
import { ipcMain, safeStorage, shell } from 'electron';
import fs from 'fs';
import { AppLogger } from './app-logger';
import path from 'path';

ipcMain.handle('open-external', async (_event, { url }) => {
	if (typeof url === 'string' && url.trim()) {
		try {
			await shell.openExternal(url);
			return { success: true };
		} catch (error) {
			AppLogger.getInstance().error('open-external: ' + (error?.message || 'Failed to open URL'));
			return { success: false, error: error?.message || 'Failed to open URL' };
		}
	} else {
		return { success: false, error: 'Invalid URL' };
	}
});