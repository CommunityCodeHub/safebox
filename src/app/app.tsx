import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import windowsFileManagerTheme from '../theme/windowsFileManagerTheme';
import Login from './user-components/Login';
import RegisterUser from './user-components/RegisterUser';
import Landing from './Landing';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardComponent from './dashboard-component/DashboardComponent';
import ApplicationCredentialsListComponent from './application-credentail-components/application-credentails-list-component';
import BankAccountCredentialListComponent from './bank-account-credentail-components/bank-account-credentails-list-component';
import NotesListComponent from './notes-components/notes-list-component';
import HelpComponent from './help-component/help-component';
import { IUserSettings } from '../entities/db-entities/user-settings';
import { ApplicationConstants } from '../entities/application.constants';
import { UserSettingsContext, UserSettingsProvider } from './services/user-settings-context';
import { HashRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_MINUTES = 15;
const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;


const App: React.FC = () => {
	
	const navigate = useNavigate();
	const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
	const [userSettings, setUserSettings] = React.useState<IUserSettings | null>(null);

	// --- Auto logout logic ---
	const logout = React.useCallback(() => {
		signOutLoggedInUser();
	}, []);

	React.useEffect(() => {
		let logoutTimer: NodeJS.Timeout;
		const resetTimer = () => {
			if (logoutTimer) clearTimeout(logoutTimer);
			logoutTimer = setTimeout(logout, AUTO_LOGOUT_MS);
		};
		// List of events that indicate user activity
		const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
		events.forEach(event => window.addEventListener(event, resetTimer));
		resetTimer();
		return () => {
			if (logoutTimer) clearTimeout(logoutTimer);
			events.forEach(event => window.removeEventListener(event, resetTimer));
		};
	}, [logout]);

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

	const onLoginComplete = (userSettings: IUserSettings) => {
		setUserSettings(userSettings);
		setIsUserLoggedIn(true);
	};

	const signOutLoggedInUser = () => {
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
					sessionStorage.removeItem('IsLoggedIn');
					sessionStorage.removeItem('LastLoggedInTime');
					sessionStorage.removeItem('UserName');
					return false;
				}
				else {
					return true;
				}
			}
		}
		return false;
	}

	//TODO: Move this method to a common place. 
	const ReadUserSettingsFile = async (username: string): Promise<IUserSettings | undefined> => {
		if (!window.api || typeof window.api.readUserSettingsFile !== 'function') {
			window.api.showAlert('Unhandled Exception', 'Read user settings file API not available. Please check application logs for details.', 'error');
			return;
		}
		const result = await window.api.readUserSettingsFile(username);

		if (result.success) {
			setUserSettings(result.data);

			return result.data;
		}

		if (result.error == ApplicationConstants.Messages.USER_SETTINGS_FILE_NOT_FOUND) {
			const result = await window.api.showConfirm("Confirm Registration", "It looks like your account is not yet registered for this application on this device. If you’ve already registered on some another device, please use the same UserName, Workspace Folder (Cloud Folder) and Encryption Key to register your account here as well.", "warning");
			if (result.response === 0) { // Ok
				navigate("/register");
				return;
			}
		}
		if (result.error == ApplicationConstants.Messages.FAILED_TO_READ_USER_SETTINGS_FILE) {
			window.api.showAlert('Configuration Error', 'Failed to read user settings file. Please check application logs for details.', 'error');
		}
	}

		return (
			<ThemeProvider theme={windowsFileManagerTheme}>
			<CssBaseline />
					<Routes>
						{/* Protected routes */}
						<Route path="/app" element={
							isUserLoggedIn ? (
								<UserSettingsContext.Provider value={userSettings}>
									<Landing />
								</UserSettingsContext.Provider>
							) : (
								<Navigate to="/login" replace />
							)
						}>
							  <Route path="dashboard" element={<DashboardComponent />} />
							  <Route path="application-credentials" element={<ApplicationCredentialsListComponent />} />
							  <Route path="bank-account-credentials" element={<BankAccountCredentialListComponent />} />
							  <Route path="notes" element={<NotesListComponent />} />
							  <Route path="help" element={<HelpComponent />} />
							  <Route index element={<Navigate to="dashboard" replace />} />
						</Route>
						{/* Auth routes */}
						<Route path="/login" element={
							isUserLoggedIn ? (
								<Navigate to="/app/dashboard" replace />
							) : (
								<Login onLoginComplete={onLoginComplete}
									
								/>
							)
						} />
						<Route path="/register" element={
							<RegisterUser/>
						} />
						{/* Redirect root and unknown routes */}
						<Route path="/" element={<Navigate to={isUserLoggedIn ? "/app/dashboard" : "/login"} replace />} />
						<Route path="*" element={<Navigate to={isUserLoggedIn ? "/app/dashboard" : "/login"} replace />} />
					</Routes>
		</ThemeProvider>
	);
};

const root = createRoot(document.body);
root.render(<HashRouter>
    <App />
  </HashRouter>);