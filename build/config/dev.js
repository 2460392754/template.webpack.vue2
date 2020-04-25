const Chalk = require('chalk');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Utils = require('../utils');

function config(conf) {
    return {
        // 缓存到内存中
        cache: true,

        // 热更新
        devServer: {
            hot: true,

            // 是否自动打开浏览器页面
            open: conf.open,

            host: conf.host,

            port: conf.port,

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
            progress: true,

            // nginx代理
            proxy: {
                '/': {
                    target: conf.proxyUrl,
                    changeOrigin: true
                }
            },

            // 支持 window.history 模式资源刷新
            historyApiFallback: true
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
                            `http://${conf.host}:${conf.port}`
                        )}`
                    ]
                },

                onErrors(severity, errors) {
                    console.log(Chalk.red(`webpack complie ${severity}: `));
                    console.log(errors);
                },

                // 每次编译之后清除控制台
                clearConsole: true
            })
        ]
    };
}

module.exports = config;
