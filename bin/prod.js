#!/usr/bin/env node
const shell = require('shelljs');

const cwd = process.cwd();

shell.cd(cwd);
shell.exec(`npm run prod ${process.argv.slice(2).join(' ')}`);
