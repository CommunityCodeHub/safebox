// Type declaration for window.api exposed by Electron preload

// Extend window.api for reading and decrypting user file
declare global {
	interface Window {
		api?: {
			registerUser: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
			readUserFile?: (username: string, password: string, workspacePath: string) => Promise<{ success: boolean; valid?: boolean; error?: string }>;
		};
	}
}

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login';
import RegisterUser from './RegisterUser';

const App: React.FC = () => {
	const [showRegister, setShowRegister] = React.useState(false);
	const [loginError, setLoginError] = React.useState<string | undefined>(undefined);

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
			alert('Login successful!');
			// Proceed to app...
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
			{showRegister ? (
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