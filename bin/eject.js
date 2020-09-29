#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
var shell = require('shelljs');

const resolve = (dir = '') => path.join(__dirname, dir);

const cwd = process.cwd();
console.log('cwd: ', cwd);

const projectFolder = path.join(cwd);
shell.cp('-Rf', resolve('../build'), `${projectFolder}/`);
shell.cp('-Rf', resolve('../config'), `${projectFolder}/`);

fs.writeFile(path.join(cwd, 'eject.txt'), '1', function (err) {
    if (err) console.error(err);
});
