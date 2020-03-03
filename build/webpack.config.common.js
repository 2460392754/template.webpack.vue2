const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { common: CommonConfig } = require('./config');

module.exports = function(config) {
    config = Object.assign(CommonConfig, config);

    return {
        // 环境
        mode: config.mode,

        // 源代码映射
        devtool: config.jsMap ? config.devtool : 'none',

        // 入口文件
        entry: {
            main: Path.resolve(__dirname, '../src/main.js')
        },

        output: {
            // 打包文件输出目录
            path: Path.resolve(__dirname, '../dist', config.assetsDir),
            // js 文件名称
            filename: 'js/[name].[hash:8].js',
            // 生成的 chunk 名称
            chunkFilename: 'js/[name].[hash:8].js',
            // 资源引用路径
            publicPath: config.publicDir
            // publicPath: config.assetsDir
        },

        resolve: {
            // 路径别名
            alias: {
                '@': Path.resolve(__dirname, '../src'),
                vue$: 'vue/dist/vue.runtime.esm.js'
            },
            extensions: ['.js', '.vue']
        },

        module: {
            rules: [
                // vue文件
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: 'cache-loader'
                        },
                        {
                            loader: 'thread-loader'
                        },
                        {
                            loader: 'vue-loader',
                            options: {
                                compilerOptioins: {
                                    preserveWhitespace: true
                                }
                            }
                        }
                    ]
                },

                {
                    test: /\.jsx?$/,
                    exclude: '/node_modules/',
                    use: [
                        {
                            loader: 'babel-loader'
                        },
                        {
                            loader: 'cache-loader'
                        },
                        {
                            loader: 'thread-loader'
                        }
                    ]
                },

                // scss or css
                {
                    test: /\.(c|sc|sa)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('dart-sass')
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },

                // 图片
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            loader: 'file-loader',
                            options: {
                                esModule: false,
                                limit: 10240,
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                },

                // 媒体文件
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'media/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },

                // 字体文件
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'fonts/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },

        plugins: [
            // 配置环境变量
            new Webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(config.mode)
                }
            }),

            // html运行模板
            new HtmlWebpackPlugin({
                template: Path.resolve(__dirname, '../public/index.html'),
                // cache: true,
                filename: '../index.html'
            }),

            // css从vue中拆分, 编译成单独的文件
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css'
            }),

            // vue文件解析器
            new VueLoaderPlugin(),

            // 样式审查
            new StyleLintPlugin({
                files: ['src/**/*.vue', 'src/**/*.l?(e|c)ss']
            })
        ]
    };
};
