import { app, ipcMain, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import { IUserSettings } from './../entities/db-entities/user-settings';
import { AppLogger } from './app-logger';
import { ApplicationConstants } from '../entities/application.constants';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { StrongCrypto } from '../cryptography/cryptoUtils';

ipcMain.handle('write-user-settings-file', async (_event, { data }) => {
    var userSettingsFolderPath = "";
    const appDataFolder = app.getPath('userData');
    const logger = AppLogger.getInstance();
    try {
        logger.info("AppDataFolder Path: " + appDataFolder);
        userSettingsFolderPath = path.join(appDataFolder, 'SafeBoxAppData');
        logger.info("UserSettingsFolder Path: " + userSettingsFolderPath);

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
        logger.info("UserSettings FileName: " + fileName);
        const filePath = path.join(userSettingsFolderPath, fileName);
        logger.info("UserSettings FilePath: " + filePath);

        fs.writeFileSync(filePath, JSON.stringify(userSettings, null, 2), 'utf-8');

        logger.info("UserSettings written successfully.");

        return { success: true, filePath };
    } catch (err) {
        logger.error("Error: " + err.message);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
});

ipcMain.handle('read-user-settings-file', async (_event, { username }) => {
    const appDataFolder = app.getPath('userData');
    const userSettingsFolderPath = path.join(appDataFolder, 'SafeBoxAppData');
    const filePath = path.join(userSettingsFolderPath, `${username}.config`);
    const logger = AppLogger.getInstance();
    logger.info("UserSettings FilePath for read: " + filePath);
    if (!fs.existsSync(filePath)) {
        return { success: false, error: ApplicationConstants.Messages.USER_SETTINGS_FILE_NOT_FOUND };
    }
    try {
        const data: any = fs.readFileSync(filePath, 'utf-8');
        logger.info("UserSettings file read completed.");
        const userSettingData = JSON.parse(data);
        logger.info("UserSettings JSON data parsed successfully. ");
        const userSettings: IUserSettings = {
            UserName: userSettingData.UserName,
            Password: safeStorage.decryptString(Buffer.from(userSettingData.Password, 'base64')),
            EncryptionKey: safeStorage.decryptString(Buffer.from(userSettingData.EncryptionKey, 'base64')),
            WorkspacePath: userSettingData.WorkspacePath,
        };
        logger.info("User settings read operation completed successfully.");
        return { success: true, data: userSettings };
    } catch (error) {
        logger.error("Error: " + error.message);
        return { success: false, error: ApplicationConstants.Messages.FAILED_TO_READ_USER_SETTINGS_FILE };
    }

});

ipcMain.handle('is-valid-encryption-key', async (_event, { encryptionKey, workspacePath, username }) => {
    const logger = AppLogger.getInstance();
    const seedFileName = `safeboxsettings.config`;
    try {
        var seedFilePath = path.join(workspacePath, seedFileName);
        const crypto = new StrongCrypto(encryptionKey);
        if (!fs.existsSync(seedFilePath)) {
            const uniqueId = uuidv4();

            const encrypted = crypto.encrypt(uniqueId);
            const encryptedPayload = JSON.stringify({
                cipherText: encrypted.cipherText,
                iv: encrypted.iv,
                tag: encrypted.tag
            });
            fs.writeFileSync(seedFilePath, encryptedPayload, 'utf-8');
            logger.info("Seed file is generated successfully.");
            return { success: true, message: 'Seed file created with given encryption key.', error: null, code: 100 };
        }

        try {
            const encryptedPayload: any = fs.readFileSync(seedFilePath, 'utf-8');
            const decryptedUUID = crypto.decrypt(encryptedPayload.cipherText, encryptedPayload.iv, encryptedPayload.tag);
            if (isValidUUID(decryptedUUID)) {
                logger.info("Seed file is present and encryption key is valid.");
                return { success: true, message: 'Encryption key is valid.', error: null, code: 101 };
            }
        }
        catch (ex) {
            logger.error("Failed to decrypt seed file. ");
            logger.error("Error: " + ex.message);
            return { success: false, error: 'SafeBox application files are already present in the Workspace folder, but the provided encryption key does not match. SafeBox cannot decrypt the files with this key. Please ensure you enter the same encryption key that was used previously.', code: 102 };

        }
        
    } catch (error) {
        logger.error("Error: " + error.message);
        return { success: false, error: 'An unknown error occurred while validating encryption key.', code: 104 };
    }
});