const fs = require('fs');
const path = require('path');


const outDir = path.join(__dirname, 'out', 'make');
const platforms = {
  Windows: ['.exe', '.zip'],
  macOS: ['.dmg', '.zip'],
  Linux: ['.deb', '.rpm', '.zip']
};

function findInstallers(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      results.push(...findInstallers(path.join(dir, file.name), exts));
    } else {
      for (const ext of exts) {
        if (file.name.endsWith(ext)) {
          results.push(path.relative(__dirname, path.join(dir, file.name)));
        }
      }
    }
  }
  return results;
}

const installerTable = [];
for (const [platform, exts] of Object.entries(platforms)) {
  const found = findInstallers(outDir, exts);
  if (found.length > 0) {
    installerTable.push(`| ${platform} | ${found.map(f => `[${path.basename(f)}](${f.replace(/\\/g, '/')})`).join(' / ')} |`);
  } else {
    installerTable.push(`| ${platform} | Not found |`);
  }
}

const releaseLink = '\n[View all releases and downloads on GitHub](https://github.com/CommunityCodeHub/safebox/releases)\n';
const tableHeader = `\n## Latest Installers${releaseLink}| Platform | Installer |\n|---|---|\n`;
const tableContent = installerTable.join('\n') + '\n';

const readmePath = path.join(__dirname, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

if (readme.includes('## Latest Installers')) {
  // Replace the existing table
  readme = readme.replace(/## Latest Installers[\s\S]*?(?=\n##|$)/, tableHeader + tableContent);
} else {
  // Insert the table after the first heading
  const firstHeading = readme.indexOf('\n');
  readme = readme.slice(0, firstHeading) + tableHeader + tableContent + readme.slice(firstHeading);
}

fs.writeFileSync(readmePath, readme);
console.log('README.md updated with installer table.');
