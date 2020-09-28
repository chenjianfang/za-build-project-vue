const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const core = require('./core');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

exports.assetsPath = function (_path) {
    const assetsSubDirectory = '';
    return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
    options = options || {};

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    var postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    function generateLoaders(loader, loaderOptions) {
        const initCssLoader = [];
        if (process.env.NODE_ENV === 'production') {
            initCssLoader.push(MiniCssExtractPlugin.loader);
        } else {
            initCssLoader.push('style-loader')
        }
        initCssLoader.push(cssLoader);
        if (options.usePostCSS) {
            initCssLoader.push(postcssLoader);
        }
        if (loader) {
            initCssLoader.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }
        return initCssLoader;
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    const output = [];
    const loaders = exports.cssLoaders(options);
    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
};

exports.createNotifierCallback = function () {
    const notifier = require('node-notifier');

    return (severity, errors) => {
        if (severity !== 'error') {
            return;
        }
        const error = errors[0];

        const filename = error.file && error.file.split('!').pop();
        notifier.notify({
            title: '',
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        });
    };
};

/*
* 需要编译的页面，通过 --page判断，如果--page无则默认为'src/pages'
* */
let pagesList = [];
function getPages() {
    if (!pagesList.length) {
        const pageName = core.filterArg('page');
        let dirs = fs.readdirSync(core.cwdPath('src/pages'));
        let pages = dirs.filter(item => item !== '.DS_Store');
        let pageEntry = [];
        if (pageName && pageName !== 'all') {
            pageEntry = pageName.split(',').filter((item) => {
                return pages.includes(item);
            });
        }
        if (pageEntry.length) {
            pages = pageEntry;
        }
        pagesList = pages;
    }
    return pagesList;
}
exports.getPages = getPages;

/**
 * 初始化入口文件
 */
exports.createEntries = function () {
    var dirArray = getPages();
    let entryObject = {};
    if (dirArray.length > 0) {
        dirArray.forEach(page => {
            let entryPath = core.cwdPath(`/src/pages/${page}/index.js`);
            if (fs.existsSync(entryPath)) {
                entryObject[page] = entryPath;
            } else {
                console.log(chalk.red(`警告：入口文件${entryPath}不存在 `));
            }
        });
    }
    console.log(entryObject);
    return entryObject;
};

exports.createHtmlPackPlugins = function () {
    var dirArray = getPages();
    let htmlPluginArray = [];
    if (dirArray.length > 0) {
        dirArray.forEach(page => {
            let templateFile = core.cwdPath(`src/pages/${page}/index.ejs`);
            let targetPath = `${exports.getConfigCwdPath('outputPath')}/${page}/index.html`;
            if (fs.existsSync(templateFile)) {
                htmlPluginArray.push(new HtmlWebpackPlugin({
                    chunks: [page],
                    filename: targetPath,
                    template: templateFile,
                    inject: true,
                    minify: {
                        removeComments: process.env.NODE_ENV === 'production',
                        collapseWhitespace: process.env.NODE_ENV === 'production',
                        removeAttributeQuotes: false,
                    },
                    env: process.env.NODE_ENV
                }));
            } else {
                console.log(chalk.red(`警告：模板文件${templateFile}不存在 \n `));
                // throw new Error('模板文件不存在');
            }
        });
        return htmlPluginArray;
    } else {
        chalk.red('pages 目录不存在');
    }
};

exports.createManifest = function(buildPage) {
    return new ManifestPlugin({
        fileName: `../${buildPage}_manifest.json`,
        publicPath: `${buildPage}/`,
        filter({ name }) {
            return name.includes('.js');
        }
    })
}

// 获取build-config配置
let buildConfig;
exports.getBuildConfig = function (key) {
    if (buildConfig) return buildConfig[key];
    buildConfig = fs.readFileSync(core.cwdPath('./build-config.json'), 'utf8');
    buildConfig = JSON.parse(buildConfig);
    return buildConfig[key];
};

// 获取 build-config 的路径值的cwd路径
exports.getConfigCwdPath = function (key) {
    const buildDir = exports.getBuildConfig(key);
    if (typeof buildDir !== 'string') {
        throw Error('必须是字符串');
    }
    return core.cwdPath(buildDir);
};
