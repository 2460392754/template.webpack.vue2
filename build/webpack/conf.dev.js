const Webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Server = require('./server');
const Utils = require('../utils/utils');
const { dev: ConfigDev } = require('../config');

if (process.argv.length && process.argv[2].includes('server')) {
    process.argv = [];
    Server(ConfigDev, [config]);
}

function config() {
    return {
        // 缓存到内存中
        cache: true,

        // 热更新
        devServer: {
            hot: true,

            // open: true,

            host: this.host,

            port: this.port,

            contentBase: Utils.resolve('/dist'),

            // 编译出现错误时，将错误直接显示在页面上
            overlay: true,

            // 浏览器控制台不打印内容
            clientLogLevel: 'none',

            // 终端控制台运行不打印内容
            quiet: true,

            // 实时刷新
            inline: true,

            // 使用gizp
            compress: true,

            // 编译进度条
            progress: true
        },

        plugins: [
            // 热更新
            new Webpack.HotModuleReplacementPlugin(),

            // 开启热更新，显示模块的相对路径
            new Webpack.NamedModulesPlugin(),

            // 编译错误时停止运行
            new Webpack.NoEmitOnErrorsPlugin(),

            // html运行模板
            new HtmlWebpackPlugin({
                template: Utils.resolve('/public/index.html'),
                // cache: true,
                filename: './index.html'
            }),

            // 终端内容显示
            new FriendlyErrorsWebpackPlugin({
                // 编译成功
                compilationSuccessInfo: {
                    messages: [
                        `Your application is running here: ${Chalk.blue(
                            `http://${this.host}:${this.port}`
                        )}`
                    ]
                },

                // 每次编译之后清除控制台
                clearConsole: true
            })
        ]
    };
}

module.exports = config;
