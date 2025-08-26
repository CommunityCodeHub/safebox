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
    };
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
      customMethod: () => Promise<any>;
    };
  }
}
