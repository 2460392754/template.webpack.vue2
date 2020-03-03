const Path = require('path');
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WebpackConfigCommon = require('./webpack.config.common');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { prod: ProdConfig, dll: DllConfig, common: CommonConfig } = require('./config');
const Config = Object.assign(CommonConfig, ProdConfig, DllConfig);

module.exports = WebpackMerge(WebpackConfigCommon(ProdConfig), {
    // 优化
    optimization: {
        // 代码分割
        splitChunks: {
            // chunks: 'async',
            // minSize: 30000,
            // minChunks: 1,
            // maxAsyncRequests: 5,
            // maxInitialRequests: 3,
            // automaticNameDelimiter: '~',
            // name: true,
            // cacheGroups: {
            //     vendors: {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10
            //     },
            //     default: {
            //         minChunks: 2,
            //         priority: -20,
            //         reuseExistingChunk: true
            //     }
            // }
            // // -----
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/]/,
                    priority: -10,
                    // minSize: 30000,
                    chunks: 'initial'
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
    },

    module: {
        rules: [
            // 图片压缩
            // {
            //     test: /\.(jpe?g|png|gif)$/i,
            //     use: [
            //         {
            //             loader: 'image-webpack-loader',
            //             options: {
            //                 bypassOnDebug: true
            //             }
            //         }
            //     ]
            // }
        ]
    },

    plugins: [
        // 引入dll，加快编译
        new Webpack.DllReferencePlugin({
            context: __dirname,
            manifest: Path.resolve(__dirname, Config.dllDir, 'vendor.manifest.json')
        }),

        // css代码压缩
        new OptimizeCssnanoPlugin({
            sourceMap: Config.cssMap,
            cssnanoOptions: {
                preset: [
                    'default',
                    {
                        mergeLonghand: false,
                        cssDeclarationSorter: false
                    }
                ]
            }
        }),

        // 拷贝`public`文件夹
        new CopyWebpackPlugin([
            {
                from: Path.resolve(__dirname, '../public'),
                to: Path.resolve(__dirname, '../dist')
            }
        ]),

        // 添加 gzip
        new CompressionPlugin({
            test: /\.js$|\.html$|\.css/,
            threshold: 10240, // 超过10kb的文件进行压缩
            deleteOriginalAssets: false, // 是否删除源文件
            minRatio: 0.8,
            cache: true
        }),

        // 将`dll`注入到生成的`html`模板中
        new AddAssetHtmlPlugin({
            filepath: Path.resolve(__dirname, Config.dllDir, '*.dll.js'),
            outputPath: './dll', // 文件目录
            publicPath: Config.publicDir + 'dll' // 注入路径
        }),

        // 删除`dist`文件夹
        new CleanWebpackPlugin()
    ]
});
