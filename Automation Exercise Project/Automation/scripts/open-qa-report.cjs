const { existsSync } = require('node:fs');
const { spawn } = require('node:child_process');
const { resolve } = require('node:path');

// find the latest branded report
const reportPath = resolve('test-results', 'qa-analytics', 'index.html');

// stop with a clear message when no report exists
if (!existsSync(reportPath)) {
  console.error('no qa analytics report was found. run npm test first.');
  process.exit(1);
}

// open the report with the default browser
const command =
  process.platform === 'win32'
    ? ['cmd', ['/c', 'start', '', reportPath]]
    : process.platform === 'darwin'
      ? ['open', [reportPath]]
      : ['xdg-open', [reportPath]];

const child = spawn(command[0], command[1], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
});

child.unref();
