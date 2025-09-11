import { ipcMain, app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import https from 'https';

// Fetch JSON manifest from URL
function fetchManifest(manifestUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(manifestUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

// Compare semver-like versions (simple)
function isNewerVersion(remote: string, local: string) {
  const r = remote.split('.').map(Number);
  const l = local.split('.').map(Number);
  for (let i = 0; i < Math.max(r.length, l.length); i++) {
    const rv = r[i] || 0;
    const lv = l[i] || 0;
    if (rv > lv) return true;
    if (rv < lv) return false;
  }
  return false;
}

export function initializeAutoUpdater(mainWindow: BrowserWindow) {
  // Wire autoUpdater events to renderer
  autoUpdater.on('checking-for-update', () => mainWindow.webContents.send('update-event', { type: 'checking-for-update' }));
  autoUpdater.on('update-available', (info) => mainWindow.webContents.send('update-event', { type: 'update-available', info }));
  autoUpdater.on('update-not-available', (info) => mainWindow.webContents.send('update-event', { type: 'update-not-available', info }));
  autoUpdater.on('error', (err) => mainWindow.webContents.send('update-event', { type: 'error', message: err == null ? 'unknown' : (err as Error).message }));
  autoUpdater.on('download-progress', (progress) => mainWindow.webContents.send('update-event', { type: 'download-progress', progress }));
  autoUpdater.on('update-downloaded', (info) => mainWindow.webContents.send('update-event', { type: 'update-downloaded', info }));

  // IPC handlers
  ipcMain.handle('check-for-updates', async (_event, { manifestUrl }: { manifestUrl?: string }) => {
    const currentVersion = app.getVersion();
    try {
      if (!manifestUrl) {
        // If no manifestUrl provided, use electron-updater's checkForUpdates
        const res = await autoUpdater.checkForUpdates();
        return { success: true, updateInfo: res, source: 'autoUpdater' };
      }
      const manifest = await fetchManifest(manifestUrl);
      const remoteVersion = manifest.version;
      if (isNewerVersion(remoteVersion, currentVersion)) {
        return { success: true, updateAvailable: true, manifest };
      }
      return { success: true, updateAvailable: false };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });

  ipcMain.handle('download-update', async () => {
    try {
      await autoUpdater.checkForUpdates();
      // autoUpdater will emit events for progress and downloaded
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });

  ipcMain.handle('quit-and-install', async () => {
    try {
      autoUpdater.quitAndInstall();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
