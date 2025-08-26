export class ApplicationConstants {
    static readonly FileNames = {
        USER_SETTINGS_FILE: 'user-settings.json',
        BANK_ACCOUNT_CREDENTIALS_FILE: 'bank-account-credentials.json',
        APPLICATION_CREDENTIALS_FILE: 'application-credentials.json',
        NOTES_FOLDER_NAME: 'notes'
    };
    static readonly Messages = {
        USER_SETTINGS_FILE_NOT_FOUND: 'User settings file not found.',
        BANK_ACCOUNT_CREDENTIALS_FILE_NOT_FOUND: 'Bank account credentials file not found.',
        APPLICATION_CREDENTIALS_FILE_NOT_FOUND: 'Application credentials file not found.',
        FAILED_TO_READ_USER_SETTINGS_FILE: 'Failed to read user settings file.',
        FAILED_TO_WRITE_USER_SETTINGS_FILE: 'Failed to write user settings file.',
        ACCOUNT_NOT_REGISTERED: `UserName: {username} for this application on this device. If you’ve already registered on another device, please use the same Encryption Key to register your account here as well.`,
    };
}

    
