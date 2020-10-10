'use strict';
var webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const core = require('./core');
const utils = require('./utils');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const extraPlugins = [];
if (utils.getBuildConfig('eslintSwitch')) {
    extraPlugins.push(new ESLintPlugin({
        context: core.cwdPath(),
        files: ['src'],
        extensions: ['vue', 'js']
    }));
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
                    name: 'images/[name].[hash:7].[ext]'
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[hash:7].[ext]'
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
