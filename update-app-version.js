const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const versionTs = `export const APP_VERSION = '${pkg.version}';\n`;
fs.writeFileSync('./src/app/app-version.ts', versionTs);
console.log('app-version.ts updated to', pkg.version);
