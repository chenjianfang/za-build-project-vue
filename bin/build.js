#!/usr/bin/env node
const { exec } = require('child_process');
var shell = require('shelljs');
const utils = require('../build/utils');
const core = require('../build/core');

const log = console.log;

// 获取命令行参数
const argsMap = {};
process.argv.slice(2).forEach((args) => {
    args.split(' ').forEach((arg) => {
        if (/^--/.test(arg)){
            const argItem = arg.slice(2);
            if (argItem.includes('=')) {
                const argArr = argItem.split('=');
                argsMap[argArr[0]] = argArr[1];
            }
        }
    });
});

// 当没有page参数并且有static参数，则只做拷贝
if (!argsMap.page && argsMap.static) {
    utils.getBuildConfig('copyStatic').forEach(({ from, to }) => {
        shell.cp('-Rf', core.cwdPath(from), core.cwdPath(to));
        log(`拷贝静态文件成功：${from} ---> ${to}`);
    });
    return;
}

// 获取构建页面
const pageEntryDir = utils.getPages();
log('构建的页面: ', pageEntryDir);

delete argsMap.page;
let otherArgv = [];
Object.entries(argsMap).forEach(([key, value]) => {
    otherArgv.push(`--${key}=${value}`);
});

Object.keys(pageEntryDir).forEach((page) => {
    log(`运行：npx za-prod-vue --page=${page} ${otherArgv.join(' ')}`);
    exec(`npx za-prod-vue --page=${page} ${otherArgv.join(' ')}`, {maxBuffer: 1024 * 1024 * 10}, function(err, stdout, stderr){
        if(stderr){
            log('stderr: ');
            log(stderr);
            log(err);
            return;
        }
        if(err){
            log('Error: ');
            log(err);
            return;
        }
        log(stdout);
    });
});