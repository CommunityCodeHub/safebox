
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login';
import RegisterUser from './RegisterUser';

const App: React.FC = () => {
	const [showRegister, setShowRegister] = React.useState(false);
	const [loginError, setLoginError] = React.useState<string | undefined>(undefined);

	const handleLogin = (username: string, password: string) => {
		// TODO: Implement login logic
		setLoginError(undefined);
		alert(`Login: ${username}`);

        var workspacePath = localStorage.getItem(`${username}-workspacePath`);
        alert(`Workspace Path: ${workspacePath}`);
	};

	const handleRegister = (username: string, password: string, workspacePath: string) => {
		// TODO: Implement registration logic
		setShowRegister(false);
		alert(`Registered: ${username} at ${workspacePath}`);
        // localStorage.setItem('username', username);
        // localStorage.setItem('workspacePath', workspacePath);
        localStorage.setItem(`${username}-workspacePath`, workspacePath);
        
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