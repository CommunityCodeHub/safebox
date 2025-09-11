export {}; // Ensures this file is treated as a module

declare global {
  interface Window {
    api: {
      registerUser: (username: string, password: string, workspacePath: string) => Promise<any>;
      readUserFile: (username: string, password: string, workspacePath: string) => Promise<any>;
      readBankAccountCredentialsFile: (workspacePath: string, encryptionKey: string) => Promise<any>;
      writeBankAccountCredentialsFile: (workspacePath: string, data: any, encryptionKey: string) => Promise<any>;
      writeApplicationCredentialsFile: (workspacePath: string, data: any, encryptionKey: string) => Promise<any>;
      readApplicationCredentialsFile: (workspacePath: string, encryptionKey: string) => Promise<any>;
      openExternal: (url: string) => Promise<any>;
      readUserSettingsFile: (username: string) => Promise<any>;
      writeUserSettingsFile: (data: any) => Promise<any>;
  // Notes methods
  writeNotePage: (workspacePath: string, pageTitle: string, content: string, encryptionKey: string) => Promise<any>;
  readNotePage: (workspacePath: string, pageTitle: string, encryptionKey: string) => Promise<any>;
  listNotePages: (workspacePath: string) => Promise<any>;
  deleteNotePage: (workspacePath: string, pageTitle: string) => Promise<any>;
  renameNotePage: (workspacePath: string, oldTitle: string, newTitle: string) => Promise<any>;
  createNotePage: (workspacePath: string, pageTitle: string) => Promise<any>;

  isValidEncryptionKey(encryptionKey: string, workspacePath: string, username: string): Promise<any>;
  showDirectoryBrowser: () => Promise<string | undefined>; 
  showAlert: (title: string, message: string, type: 'info' | 'warning' | 'error') => Promise<any>;
  showConfirm: (title: string, message: string, type: 'info' | 'warning' | 'error') => Promise<any>;
  // Update APIs
  checkForUpdates: (manifestUrl?: string) => Promise<any>;
  downloadUpdate: () => Promise<any>;
  quitAndInstall: () => Promise<any>;
  onUpdateEvent: (callback: (event: any) => void) => void;
  pathExists: (targetPath: string) => Promise<any>;
  // Logging methods
  setLogLevel: (level: string) => Promise<any>;
  logMessage: (level: string, message: string) => Promise<any>;
  logError: (message: string) => Promise<any>;
  logTrace: (message: string) => Promise<any>;
  logMetric: (message: string) => Promise<any>;
    };
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
      customMethod: () => Promise<any>;
    };

    
  }
}
