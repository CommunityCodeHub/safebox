import { ipcMain } from 'electron';

import { AppLogger, LogLevel } from './app-logger';
import { ApplicationConstants } from '../entities/application.constants';


// Use a single logger instance with a constant log file name
const LOG_FILE_NAME = ApplicationConstants.FileNames.APPLICATION_LOG_FILE || 'application.log';
let logger: AppLogger = AppLogger.getInstance(LOG_FILE_NAME);

ipcMain.handle('set-log-level', async (_event, { level }) => {
  logger.setLevel(level);
  return { success: true };
});

ipcMain.handle('log-message', async (_event, { level, message }) => {
  logger.info(`[${level.toUpperCase()}] ${message}`);
  return { success: true };
});

ipcMain.handle('log-error', async (_event, { message }) => {
  logger.error(message);
  return { success: true };
});

ipcMain.handle('log-trace', async (_event, { message }) => {
  logger.trace(message);
  return { success: true };
});

ipcMain.handle('log-metric', async (_event, { message }) => {
  logger.metric(message);
  return { success: true };
});
