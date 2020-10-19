/* 生产构建 --page=值 值只能有一个页面 */
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { filterArg } = require('./core');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPage = filterArg('page');
const sourcemap = filterArg('sourcemap');

// webpack 插件列表
const pluginExtra = [];

// 生成manifest
if (sourcemap) {
    pluginExtra.push(utils.createManifest(buildPage));
}

const pageEntryDir = utils.getPages();
if (!Object.keys(pageEntryDir).includes(buildPage)) {
    return console.log(`编译页面${buildPage}不存在`);
}
console.log('buildPage: ', buildPage);
const name = buildPage.replace(/\//g, '_');
const webpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    entry: utils.createEntries(),
    devtool: sourcemap ? utils.getBuildConfig('build').devtool : false,
    output: {
        path: `${utils.getConfigCwdPath('outputPath')}/${buildPage}`,
        publicPath: `${utils.getBuildConfig("build").publicPath}${buildPage}/`,
        filename: `js/${name}.[contenthash].js`,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin(), // 最小化js
            new OptimizeCSSAssetsPlugin({}), // 最小化css
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                },
            },
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env'),
        }),
        new webpack.HashedModuleIdsPlugin(),

        new MiniCssExtractPlugin({
          filename: `css/${name}.[contenthash].css`,
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),

        new CleanWebpackPlugin(),

        ...pluginExtra
    ]
});

module.exports = webpackConfig;
