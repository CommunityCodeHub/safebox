import { ipcRenderer } from 'electron';


const registerLoginFunctions = function(){

const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginError = document.getElementById('loginError') as HTMLParagraphElement;

// Registration elements
const registerForm = document.getElementById('registerForm') as HTMLFormElement | null;
const regUsernameInput = document.getElementById('regUsername') as HTMLInputElement | null;
const regPasswordInput = document.getElementById('regPassword') as HTMLInputElement | null;
const regConfirmPasswordInput = document.getElementById('regConfirmPassword') as HTMLInputElement | null;
const registerError = document.getElementById('registerError') as HTMLParagraphElement | null;
const registerSubmitBtn = document.getElementById('registerSubmitBtn') as HTMLButtonElement | null;

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  // Simple check, replace with real validation
  if (username && password) {
    ipcRenderer.send('login-success');
  } else {
    loginError.innerText = 'Please enter username and password.';
  }
});

regPasswordInput.onchange = () => {
  if (!regPasswordInput || !registerError) return;
  const password = regPasswordInput.value;
  if (!isSecurePassword(password)) {
    registerError.innerText = 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.';
    registerSubmitBtn.disabled = true;
  } else {
    registerError.innerText = '';
  }
};

// Registration logic
function isSecurePassword(password: string): boolean {
  // Minimum 8 characters, at least 1 uppercase, 1 number, 1 special character
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!regUsernameInput || !regPasswordInput || !regConfirmPasswordInput || !registerError) return;
    const username = regUsernameInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;
    if (!username || !password || !confirmPassword) {
      registerError.innerText = 'All fields are required.';
      return;
    }
    if (password !== confirmPassword) {
      registerError.innerText = 'Passwords do not match.';
      return;
    }
    if (!isSecurePassword(password)) {
      registerError.innerText = 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.';
      return;
    }
    // Here you would save the new user credentials securely (e.g., to a file or database)
    // For now, just show a success message and close the modal
    registerError.innerText = '';
    registerForm.reset();
    // Optionally, close the modal after registration
    const modal = document.getElementById('registerModal');
    if (modal) {
      // Bootstrap 5 modal instance
      // @ts-ignore
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    }
    //alert('Registration successful! You can now log in.');
    window.api.showAlert('Registration Successful', 'You have successfully registered. You can now log in.', 'info');
  });
}


}

export default registerLoginFunctions;