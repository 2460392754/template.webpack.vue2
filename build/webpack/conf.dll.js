const Webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const Utils = require('../utils/utils');
const { dll: DllConfig } = require('../config');

module.exports = {
    mode: DllConfig.mode,

    entry: {
        vendor: DllConfig.dllVendor
    },

    output: {
        filename: '[name].[hash:8].dll.js',
        // library: '[name]',
        chunkFilename: '[name].[hash:8].dll.js',
        path: Utils.resolve(DllConfig.dllDir)
    },

    plugins: [
        // 删除`output.path`文件夹
        new CleanWebpackPlugin(),

        // 生成 manifest.json 配置文件
        new Webpack.DllPlugin({
            name: '[name]',
            // context: __dirname,
            path: Utils.resolve(DllConfig.dllDir, '/[name].manifest.json')
        })
    ]
};
