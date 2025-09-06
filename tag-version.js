const fs = require('fs');
const { execSync } = require('child_process');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const tag = `v${pkg.version}`;
try {
  execSync(`git add package.json src/app/app-version.ts`, { stdio: 'inherit' });
  execSync(`git commit -m "chore: bump version to ${pkg.version}"`, { stdio: 'inherit' });
  execSync(`git tag ${tag}`, { stdio: 'inherit' });
  execSync(`git push origin ${tag}`, { stdio: 'inherit' });
  console.log(`Created and pushed git tag: ${tag}`);
} catch (e) {
  console.error('Failed to create/push git tag:', e.message);
}
