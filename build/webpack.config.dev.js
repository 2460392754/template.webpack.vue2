const Path = require('path');
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WebpackConfigCommon = require('./webpack.config.common');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Chalk = require('chalk');
const { dev: DevConfig } = require('./config');

module.exports = WebpackMerge(WebpackConfigCommon(DevConfig), {
    // 缓存到内存中
    // cache: true,

    // 热更新
    devServer: {
        hot: true,
        open: true,
        host: DevConfig.host,
        port: DevConfig.port,
        contentBase: Path.resolve(__dirname, '../dist'),

        // 编译出现错误时，将错误直接显示在页面上
        overlay: true,

        // 浏览器控制台不打印内容
        clientLogLevel: 'none',

        // 终端控制台运行不打印内容
        quiet: true
    },

    plugins: [
        // 热更新
        new Webpack.HotModuleReplacementPlugin(),

        // 开启热更新，显示模块的相对路径
        new Webpack.NamedModulesPlugin(),

        // 编译错误，停止运行
        new Webpack.NoEmitOnErrorsPlugin(),

        // 终端内容显示
        new FriendlyErrorsWebpackPlugin({
            // 编译成功
            compilationSuccessInfo: {
                messages: [
                    `Your application is running here: ${Chalk.blue(
                        `http://${DevConfig.host}:${DevConfig.port}`
                    )}`
                ]
            },

            //每次编译之后清除控制台
            clearConsole: true
        })
    ]
});
