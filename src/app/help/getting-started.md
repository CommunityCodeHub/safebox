# Getting Started with SafeBox

Welcome to SafeBox! This guide will help you set up and start using the application to securely manage your credentials and notes.

## Installation

1. Download and install SafeBox from [github link](https://github.com/CommunityCodeHub/safebox).
2. Launch the application after installation.

## Creating Your Account

## SafeBox Registration Guide

1. Open **SafeBox** and click on the **Register** button in the login popup window.  

2. Enter your desired **Username**.  
   - It may include letters, numbers, hyphens (-), and underscores (_).  
   - Choose something easy to remember, such as your first name or combination of first name and last name.  

3. Create a strong **Password**.  
   - Must include letters, numbers, and at least one special character.  
   - Minimum length: 8 characters.  

4. Re-enter the same password in the **Confirm Password** field.  
   - If the values don’t match, an error will be displayed.  
   - Password and Confirm Password must match.  

5. Specify the **Workspace Folder Path**.  
   - This is where SafeBox will save your encrypted data.  
   - Recommended: create a dedicated folder exclusively for SafeBox.  
   - Best practice: use a folder inside a cloud storage directory (e.g., OneDrive or Google Drive) synced with your device.  
   - This ensures your data remains safe even if your device fails.  
   - Use the folder icon in the Workspace field to browse and select the folder.  

6. Set up your **Encryption Key** (your vault key).  
   - SafeBox uses this to encrypt and decrypt your data.  
   - You may enter any text, but a minimum length of **16 characters** is recommended.  
   - For stronger security, click the **refresh icon** in the Encryption Key field to auto-generate a unique key.  
   - You do **not** need to remember this key for the current device.  
     - SafeBox encrypts and stores it locally in:  
       ```
       AppData\Roaming\safe-box\SafeBoxAppData
       ```
   - **Important:** Copy and store this key securely (e.g., in an external drive).  
     - Do **not** store it as plain text on cloud storage.  
     - This key is required if you reinstall SafeBox or set it up on another device.  
     - Without it, your previously stored data cannot be decrypted.  

7. Click **Register** to complete account creation.  

![Register User](/../../assets/images/screenshots/RegisterUser.png)


## Logging In

1. Enter your username and password on the login screen.
2. Click **Login** to access your SafeBox dashboard.

## Adding Credentials

- Navigate to the **Bank Account Credentials** or **Application Credentials** tab.
- Click **Add** to enter new credentials.
- Fill in the required details and save.

## Using Notes

- Go to the **Notes** tab to create and manage secure notes.
- Click **Add Note** to start a new note.
- Use the rich text editor for formatting and organization.

## Accessing Help

- Click the **Help** menu in the sidebar to view documentation and FAQs.

## Security Tips

- Always use a strong, unique password for your account.
- Do not share your credentials with anyone.
- Log out when you are finished using SafeBox.

## Need More Help?

Visit the other help topics or contact support for further assistance.

---

Enjoy using SafeBox to keep your information secure!
