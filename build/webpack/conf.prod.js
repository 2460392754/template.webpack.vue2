const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Build = require('./build');
const Utils = require('../utils/utils');
const { prod: ConfigProd } = require('../config');

if (process.argv.length && process.argv[2].includes('build')) {
    process.argv = [];

    Build(ConfigProd, [config]);
}

function config() {
    return {
        // 优化
        optimization: {
            // 代码分割
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // vendors: {
                    //     name: 'vendors',
                    //     test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
                    //     priority: -10 // 优先级配置项
                    // },
                    // styles: {
                    //     name: 'styles',
                    //     test: /\.less|css|scss$/,
                    //     chunks: 'all',
                    //     enforce: true
                    // },
                    vendors: {
                        // 项目基本框架等
                        chunks: 'all',
                        // test: /(vue|vue-router|vuex|vant)/,
                        priority: 1,
                        name: 'vendor',
                        test: /node_modules/,
                        // chunks: 'initial',
                        minSize: 100,
                        minChunks: 1 // 重复引入了几次'
                    },
                    'async-commons': {
                        // 异步加载公共包、组件等
                        chunks: 'async',
                        minChunks: 2,
                        name: 'async-commons',
                        priority: 90
                    },
                    commons: {
                        // 其他同步加载公共包
                        chunks: 'all',
                        name: 'commons',
                        minChunks: 2, // 最少引入2次
                        minSize: 100, // 文件大小超过100b
                        priority: 80
                    }
                }
            },

            runtimeChunk: {
                name: 'manifest'
            }
        },

        plugins: [
            // 删除`dist`文件夹
            new CleanWebpackPlugin(),

            // 为模块提供中间缓存, 加快代码编译
            new HardSourceWebpackPlugin(),

            // 拷贝`public`文件夹
            new CopyWebpackPlugin([
                {
                    from: Utils.resolve('/public'),
                    to: Utils.resolve('/dist')
                }
            ]),

            // 添加 gzip
            new CompressionWebpackPlugin({
                test: /\.(js|css|html|svg)$/,
                threshold: 1024 * 10,
                deleteOriginalAssets: false, // 是否删除源文件
                minRatio: 0.8,
                cache: true
            }),

            // html运行模板
            new HtmlWebpackPlugin({
                template: Utils.resolve('/public/index.html'),
                // cache: true,
                filename: '../index.html',
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    removeAttributeQuotes: false // 是否删除属性的双引号
                }
            }),

            // css从vue中拆分, 编译成单独的文件
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css'
            })
        ]
    };
}

module.exports = config;
