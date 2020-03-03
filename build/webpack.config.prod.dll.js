const Path = require('path');
const Webpack = require('webpack');
const Chalk = require('chalk');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Hooks = require('./hooks.js');
const { dll: DllConfig } = require('./config');

module.exports = {
    mode: DllConfig.mode,

    entry: {
        vendor: DllConfig.dllVendor
    },

    output: {
        filename: '[name].[hash:8].dll.js',
        library: '[name]',
        path: Path.resolve(__dirname, DllConfig.dllDir)
    },

    plugins: [
        // 删除`output.path`文件夹
        new CleanWebpackPlugin(),

        // 生成 manifest.json 配置文件
        new Webpack.DllPlugin({
            name: '[name]',
            path: Path.join(__dirname, DllConfig.dllDir, '[name].manifest.json'),
            context: __dirname
        }),

        // 钩子
        new Hooks({
            environment() {
                console.log('\n', Chalk.blue('>>> 开始编译dll文件'), '\n');
            },

            done() {
                console.log('\n', Chalk.green('>>> 编译完成'), '\n');
            }
        })
    ]
};
