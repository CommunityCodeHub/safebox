import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import Login from './user-components/Login';
import RegisterUser from './user-components/RegisterUser';
import Landing from './Landing';
import { IUserSettings } from '../entities/db-entities/user-settings';
import { ApplicationConstants } from '../entities/application.constants';
import { UserSettingsContext, UserSettingsProvider } from './services/user-settings-context';

// declare global {
// 	interface Window {
// 		api?: {
// 			registerUser: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
// 			readUserFile?: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; valid?: boolean; error?: string }>;
// 			readBankAccountCredentialsFile?: (workspacePath: string, encryptionKey: string) => Promise<{ fileContent?: any; success: boolean; valid?: boolean; error?: string }>;
// 			writeBankAccountCredentialsFile?: (workspacePath: string, data: any, encryptionKey: string) => Promise<{ success: boolean; error?: string }>;
// 			readApplicationCredentialsFile?: (workspacePath: string, encryptionKey: string) => Promise<{ fileContent?: any; success: boolean; valid?: boolean; error?: string }>;
// 			writeApplicationCredentialsFile?: (workspacePath: string, data: any, encryptionKey: string) => Promise<{ success: boolean; error?: string }>;
// 			openExternal: (url: string) => Promise<void>;
// 			readUserSettingsFile: (username: string) => Promise<{ success: boolean; data?: IUserSettings; error?: string }>;
// 			writeUserSettingsFile: (data: IUserSettings) => Promise<{ success: boolean; error?: string }>;
// 			writeNotePage: (workspacePath: string, pageTitle: string, content: string, encryptionKey: string) => Promise<{ success: boolean; error?: string }>;
// 			readNotePage: (workspacePath: string, pageTitle: string, encryptionKey: string) => Promise<{ success: boolean; content?: string; error?: string }>;
// 			deleteNotePage: (workspacePath: string, pageTitle: string, encryptionKey: string) => Promise<{ success: boolean; error?: string }>;
// 		};
// 	}
// }

	const App: React.FC = () => {
		const [showRegister, setShowRegister] = React.useState(false);
		const [loginError, setLoginError] = React.useState<string | undefined>(undefined);
		const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
		const [userSettings, setUserSettings] = React.useState<IUserSettings | null>(null);

		// Check if user is already logged in
		React.useEffect(() => {
			const isLoggedIn = IsLoggedIn();
			if (isLoggedIn) {
				ReadUserSettingsFile(sessionStorage.getItem('UserName')).then(userSettings => {
					if (userSettings) {
						setUserSettings(userSettings);
					}
					setIsUserLoggedIn(true);
					return;
				});
			}
			setIsUserLoggedIn(false);

		}, []);

		const logOut = () => {
			sessionStorage.clear();
			window.location.reload();
		}

		const IsLoggedIn = (): boolean => {
			const isLoggedIn = sessionStorage.getItem('IsLoggedIn') === 'true';
			if (isLoggedIn) {
				// Check if last login is not more than 15 mins
				const lastLoginTime = sessionStorage.getItem('LastLoggedInTime');
				if (lastLoginTime) {
					const currentTime = new Date().getTime();
					const timeDiff = currentTime - parseInt(lastLoginTime);
					if (timeDiff > 15 * 60 * 1000) { // 15 mins in milliseconds
						//setLoggedIn(false);
						sessionStorage.removeItem('IsLoggedIn');
						sessionStorage.removeItem('LastLoggedInTime');
						sessionStorage.removeItem('UserName');
						return false;
					}
					else {
						//setLoggedIn(true);
						return true;
					}
				}
			}
			return false;
		}

		const ReadUserSettingsFile = async (username: string): Promise<IUserSettings | undefined> => {
			if (!window.api || typeof window.api.readUserSettingsFile !== 'function') {
				setLoginError('Read user settings file API not available.');
				return;
			}
			const result = await window.api.readUserSettingsFile(username);

			if (result.success) {
				setUserSettings(result.data);

				return result.data;
			}

			if (result.error == ApplicationConstants.Messages.USER_SETTINGS_FILE_NOT_FOUND) {
				window.confirm("It looks like your account is not yet registered for this application on this device. If you’ve already registered on some another device, please use the same UserName, Workspace Folder (Cloud Folder) and Encryption Key to register your account here as well.");
				setShowRegister(true);
				return;
			}
			if (result.error == ApplicationConstants.Messages.FAILED_TO_READ_USER_SETTINGS_FILE) {
				alert("Failed to read user settings file. Please check application logs for details. ")
			}
		}
	

		const handleLogin = async (username: string, password: string) => {
			setLoginError(undefined);
			const userSettings = await ReadUserSettingsFile(username);
			if (!userSettings) {
				setLoginError('Incorrect username or account not registered. Please register your account by clicking Register Button on this page.');
				return;
			}

			if (password !== userSettings.Password) {
				setLoginError('Incorrect password.');
			}

			setIsUserLoggedIn(true);
			sessionStorage.setItem('IsLoggedIn', 'true');
			sessionStorage.setItem('LastLoggedInTime', new Date().getTime().toString());
			sessionStorage.setItem('UserName', username);
		};


		const handleRegister = async (username: string, password: string, workspacePath: string, encryptionKey: string) => {
			// Call the exposed API from preload
			if (window.api && typeof window.api.registerUser === 'function') {
				var userSettings: IUserSettings = {
					UserName: username,
					Password: password,
					WorkspacePath: workspacePath,
					EncryptionKey: encryptionKey
				}

				const result = await window.api.writeUserSettingsFile(userSettings);
				if (result.success) {
					setUserSettings(userSettings);
					setShowRegister(false);
					setIsUserLoggedIn(false);
					alert(`User Registration successful!. Please login to proceed.`);
				} else {
					alert(`Registration failed: ${result.error}`);
				}
			} else {
				alert('Registration API not available.');
			}
		};

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{isUserLoggedIn ? (
					<UserSettingsContext.Provider value={userSettings}>
						<Landing />
					</UserSettingsContext.Provider>
				) : showRegister ? (
					<RegisterUser
						onRegister={handleRegister}
						onBackToLogin={() => setShowRegister(false)}
					/>
				) : (
					<Login
						onLogin={handleLogin}
						onRegister={() => setShowRegister(true)}
						error={loginError}
					/>
				)}
			</ThemeProvider>
		);
	};

	const root = createRoot(document.body);
	root.render(<App />);