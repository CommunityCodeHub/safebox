# SafeBox Security

SafeBox is built with security as its top priority. Here’s how your data is protected:

## Encryption of the SafeBox account's Credentails
When user is registered, SafeBox encrypts the Password and Encryption key using operating sytem's Data Protection API (DPAPI) a built-in Windows security feature that provides simple cryptographic functions for encrypting and decrypting data using user or machine credentials. 


## Data Encryption in SafeBox

SafeBox encrypts all sensitive data such as **Application Credentials**, **Bank Account Credentials**, and **Notes** using a secure encryption process.  

During user registration, the encryption key you provide is transformed into a **256-bit (32-byte) key** through **SHA-256 hashing**.  
This derived key is then used for **AES-256 encryption and decryption** to ensure your data remains protected.  

### ✅ Strong Points

- Uses **AES-256-GCM**, which is modern, efficient, and secure (provides authenticated encryption).  
- Uses a **random IV** per encryption, which is critical for security.  
- Includes an **authentication tag** to prevent undetected tampering.  
- Output is **portable** (base64 strings for IV, tag, and ciphertext).  


## Data Isolation and Privacy

SafeBox stores all your data exclusively within the **Workspace folder**.  
Only your SafeBox account credentials and the **Encryption Key** are saved in the `AppData` folder on your machine.  

Most importantly, SafeBox never stores any of your data or information outside your device’s boundary.  


## Application Security
- A secure **login process** at startup ensures that only authenticated users can access the data.  
- If the user remains inactive for **15 minutes**, SafeBox automatically logs them out for added protection.  
- Sensitive information (such as passwords) is always **masked by default** to prevent onlookers from stealing information.  
- SafeBox provides an option to **show or hide** this sensitive data when needed.  


## No External Storage

- All data is stored **locally on your device**. SafeBox never transmits your credentials or notes to any external server.  
- If your Workspace folder is synced with a cloud storage service (e.g., OneDrive, Google Drive), your data will be automatically backed up by Cloud Storage Services.  
  - The good part: all files are **fully encrypted**, so even if your cloud storage is compromised, the data remains useless to attackers.  


## Regular Updates
- SafeBox is regularly updated to address new security threats and vulnerabilities.

## Security Best Practices
- Always use a strong, unique password for your account.
- Do not share your credentials or notes with anyone.
- Log out when you are finished using SafeBox.

## Reporting Issues
- If you discover a security issue, please contact support immediately.

---

SafeBox is committed to keeping your information safe and private. Your security is our mission.
