#!/usr/bin/env node
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');

const cwd = process.cwd();

function resolve(dir = '') {
    return path.join(__dirname, dir);
}
const buildPath = resolve('../');

let entryPath = buildPath;
try {
    const ejectStr = fs.readFileSync(path.join(cwd, 'eject.txt'), 'utf8');
    if (ejectStr === '1') {
        entryPath = cwd;
    }
} catch (e) {
    //
}

shell.cd(entryPath);

console.log("entryPath: ", entryPath);
shell.exec(`npm run prod ${process.argv.slice(2).join(' ')} --cwd=${cwd}`);
