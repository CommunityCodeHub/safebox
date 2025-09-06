# SafeBox

SafeBox is a secure and modern desktop application designed to manage sensitive data such as bank account details, application login credentials, notes, and more. Built with Electron, React, and Material UI, it combines robust encryption with a clean, user-friendly interface and advanced features for efficient personal credential management.

## Documentation

You can find detailed guides and help topics below:

- [About SafeBox](src/app/help/about-safebox.md)
- [Getting Started](src/app/help/getting-started.md)
- [Features](src/app/help/features.md)
- [Security](src/app/help/security.md)
- [FAQ](src/app/help/faq.md)
- [Contact](src/app/help/contact.md)



## Latest Installers
[View all releases and downloads on GitHub](https://github.com/CommunityCodeHub/safebox/releases)
| Platform | Installer |
|---|---|
| Windows | [safe-box-1.0.1 Setup.exe](out/make/squirrel.windows/x64/safe-box-1.0.1 Setup.exe) / [safe-box-win32-x64-1.0.0.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.0.zip) / [safe-box-win32-x64-1.0.1.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.1.zip) |
| macOS | [safe-box-win32-x64-1.0.0.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.0.zip) / [safe-box-win32-x64-1.0.1.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.1.zip) |
| Linux | [safe-box-win32-x64-1.0.0.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.0.zip) / [safe-box-win32-x64-1.0.1.zip](out/make/zip/win32/x64/safe-box-win32-x64-1.0.1.zip) |

## Development Environment Setup 

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

### Setup Repository
1. Clone the repository:
	```sh
	git clone https://github.com/CommunityCodeHub/safebox.git
	cd safebox
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```
3. Start the application in development mode:
	```sh
	npm run start
	# or
	yarn start
	```
### Generate package for publishing
```
npm run make
# or
yarn make
```

## Encryption Details
- **Algorithm**: AES-256-GCM
- **Key Derivation**: SHA-256 hash of user-provided encryption key
- **IV**: 12 bytes random per encryption
- **Auth Tag**: Stored with each encrypted payload

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

