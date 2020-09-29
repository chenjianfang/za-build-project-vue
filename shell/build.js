const { exec } = require('child_process');
const utils = require('./utils');

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


// 获取构建页面
const buildPagesList = utils.getPages();
console.log('构建的页面: ', buildPagesList);

delete argsMap.page;
let otherArgv = [];
Object.entries(argsMap).forEach(([key, value]) => {
    otherArgv.push(`--${key}=${value}`);
});

const log = console.log;
buildPagesList.forEach((page) => {
    exec(`npx za-prod-vue --page=${page} ${otherArgv.join(' ')}`, {maxBuffer: 1024 * 1024 * 10}, function(err, stdout, stderr){
        if(stderr){
            log('stderr: ');
            log(stderr);
            log(err);
            return
        }
        if(err){
            log('Error: ');
            log(err);
            return
        }
        log(stdout);
    })
});
