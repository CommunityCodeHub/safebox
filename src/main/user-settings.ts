import { app, ipcMain, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import { IUserSettings } from './../entities/db-entities/user-settings';
import { ApplicationConstants } from '../entities/application.constants';

ipcMain.handle('write-user-settings-file', async (_event, { data }) => {
    try {
                
        
        var userSettingsFolderPath = "";

        const appDataFolder = app.getPath('userData');

        console.log("AppDataFolder Path: " + appDataFolder);

        userSettingsFolderPath = path.join(appDataFolder, 'SafeBoxAppData');

        console.log("UserSettingsFolder Path: " + userSettingsFolderPath);

        if (!fs.existsSync(userSettingsFolderPath)) {
            fs.mkdirSync(userSettingsFolderPath, { recursive: true });
        }
      
        if (!safeStorage.isEncryptionAvailable()) {
            alert("Encryption is not available");
        }

        const encryptedPassword = safeStorage.encryptString(data.Password); //crypto.encrypt(data);
        const encryptedEncrptionkey = safeStorage.encryptString(data.EncryptionKey);
        const workspacePath = data.WorkspacePath;

        const userSettings: IUserSettings = {
            UserName: data.UserName,
            Password: encryptedPassword.toString('base64'), // Convert to base64 string for storage
            EncryptionKey: encryptedEncrptionkey.toString('base64'),
            WorkspacePath: workspacePath,
        };
        const fileName = `${data.UserName}.config`;
        console.log("UserSettings FileName: " + fileName);
        const filePath = path.join(userSettingsFolderPath, fileName);
        console.log("UserSettings FilePath: " + filePath);

        fs.writeFileSync(filePath, JSON.stringify(userSettings, null, 2), 'utf-8');
        
        console.log("UserSettings written successfully.");

        return { success: true, filePath };
    } catch (err) {
        console.error("Error: " + err.message);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
});

ipcMain.handle('read-user-settings-file', async (_event, { username }) => {
    const appDataFolder = app.getPath('userData');
    const userSettingsFolderPath = path.join(appDataFolder, 'SafeBoxAppData');
    const filePath = path.join(userSettingsFolderPath, `${username}.config`);
    console.log("UserSettings FilePath for read: " + filePath);
    if (!fs.existsSync(filePath)) {
        return { success: false, error: ApplicationConstants.Messages.USER_SETTINGS_FILE_NOT_FOUND };
    }
    try {
        const data: any = fs.readFileSync(filePath, 'utf-8');
        console.log("UserSettings file read completed.");
        const userSettingData = JSON.parse(data);
        console.log("UserSettings JSON data parsed successfully. ");
        const userSettings: IUserSettings = {
            UserName: userSettingData.UserName,
            Password: safeStorage.decryptString(Buffer.from(userSettingData.Password, 'base64')),
            EncryptionKey: safeStorage.decryptString(Buffer.from(userSettingData.EncryptionKey, 'base64')),
            WorkspacePath: userSettingData.WorkspacePath,
        };
        console.log("User settings read operation completed successfully.");
        return { success: true, data: userSettings };
    } catch (error) {
        console.error("Error: " + error.message);
        return { success: false, error: ApplicationConstants.Messages.FAILED_TO_READ_USER_SETTINGS_FILE };
    }

});