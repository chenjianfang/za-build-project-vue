'use strict';
var webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const core = require('./core');
const utils = require('./utils');

const extraPlugins = [];
if (utils.getBuildConfig('eslintSwitch')) {
    extraPlugins.push(new ESLintPlugin({
        context: core.cwdPath(),
        files: ['src'],
        extensions: ['vue', 'js']
    }));
}

const copyStatic = utils.getBuildConfig('copyStatic');
if (copyStatic && copyStatic.from) {
    extraPlugins.push(
        new CopyWebpackPlugin([{
            from: core.cwdPath(copyStatic.from),
            to: core.cwdPath(copyStatic.to),
        }])
    );
}

module.exports = {
    resolve: {
        extensions: ['.js', '.vue'],
        alias: utils.getObjectCwdPath('alias')
    },
    module: {
        rules: [
            ...utils.styleLoaders({ sourceMap: false, usePostCSS: true }),
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 200, // 为了体积小，只有非常小的才可转出base64
                    name: 'images/[hash:7].[ext]'
                }
            }, {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: 'media/[hash:7].[ext]'
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: 'fonts/[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        ...utils.createHtmlPackPlugins(),
        new VueLoaderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        ...extraPlugins,
    ]
};
