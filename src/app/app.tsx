// Type declaration for window.api exposed by Electron preload

// Extend window.api for reading and decrypting user file
declare global {
	interface Window {
		api?: {
			registerUser: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
			readUserFile?: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; valid?: boolean; error?: string }>;
            readBankAccountCredentialsFile?: (workspacePath: string) => Promise<{ fileContent?: any; success: boolean; valid?: boolean; error?: string }>;
            writeBankAccountCredentialsFile?: (workspacePath: string, data: any) => Promise<{ success: boolean; error?: string }>;
			readApplicationCredentialsFile?: (workspacePath: string) => Promise<{ fileContent?: any; success: boolean; valid?: boolean; error?: string }>;
			writeApplicationCredentialsFile?: (workspacePath: string, data: any) => Promise<{ success: boolean; error?: string }>;
			openExternal: (url: string) => Promise<void>;
		};
	}
}

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import Login from './Login';
import RegisterUser from './RegisterUser';
import Landing from './Landing';

const App: React.FC = () => {
	const [showRegister, setShowRegister] = React.useState(false);
	const [loginError, setLoginError] = React.useState<string | undefined>(undefined);
	const [loggedIn, setLoggedIn] = React.useState(false);
    // Check if user is already logged in
    React.useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('IsLoggedIn') === 'true';
        if (isLoggedIn){
            // Check if last login is not more than 15 mins
            const lastLoginTime = sessionStorage.getItem('LastLoggedInTime');
            if (lastLoginTime) {
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - parseInt(lastLoginTime);
                if (timeDiff > 15 * 60 * 1000) { // 15 mins in milliseconds
                    setLoggedIn(false);
                    sessionStorage.removeItem('IsLoggedIn');
                    sessionStorage.removeItem('LastLoggedInTime');
                    sessionStorage.removeItem('UserName');
                }
                else {
                    setLoggedIn(true);
                }
            }
        }
    }, []);

	const handleLogin = async (username: string, password: string) => {
		setLoginError(undefined);
		// Get workspace path from localStorage
		const workspacePath = localStorage.getItem(`${username}-workspacePath`);
		if (!workspacePath) {
			setLoginError('Workspace path not found for this user.');
			return;
		}
		if (!window.api || typeof window.api.readUserFile !== 'function') {
			setLoginError('Read user file API not available.');
			return;
		}
		const result = await window.api.readUserFile(username, password, workspacePath);
		if (!result.success) {
			setLoginError(result.error || 'Login failed.');
			return;
		}
		if (result.valid) {
			setLoggedIn(true);
            sessionStorage.setItem('IsLoggedIn', 'true');
            sessionStorage.setItem('LastLoggedInTime', new Date().getTime().toString());
            sessionStorage.setItem('UserName', username);
		} else {
			setLoginError('Invalid password.');
		}
	};


	const handleRegister = async (username: string, password: string, workspacePath: string) => {
		// Call the exposed API from preload
		if (window.api && typeof window.api.registerUser === 'function') {
			const result = await window.api.registerUser(username, password, workspacePath);
			if (result.success) {
				setShowRegister(false);
				alert(`Registration successful! File saved at: ${result.filePath}`);
			} else {
				alert(`Registration failed: ${result.error}`);
			}
		} else {
			alert('Registration API not available.');
		}
	};

	return (
		<>
			{loggedIn ? (
				<Landing />
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
		</>
	);
};

const root = createRoot(document.body);
root.render(<App />);