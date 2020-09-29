#!/usr/bin/env node
const shell = require('shelljs');
const path = require('path');

const cwd = process.cwd();

function resolve(dir = '') {
    return path.join(__dirname, '..', dir);
}
const buildPath = resolve();
console.log("buildPath: ", buildPath);

shell.cd(buildPath);

console.log("cwd: ", cwd);
shell.exec(`npm run dev ${process.argv.slice(2).join(' ')} --cwd=${cwd}`);
