const Webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Utils = require('../utils/utils');

module.exports = function(conf) {
    const IsProd = conf.mode === 'production';
    const hash = IsProd ? '.[hash:8]' : '';

    return {
        // 环境
        mode: conf.mode,

        // 源代码映射
        devtool: conf.jsMap ? conf.devtool : 'none',

        // 入口文件
        entry: {
            main: Utils.resolve('/src/main.js')
        },

        output: {
            // 打包文件输出目录
            path: Utils.resolve('/dist', conf.assetsDir),
            // js 文件名称
            filename: `js/[name]${hash}.js`,
            // 生成的 chunk 名称
            chunkFilename: `js/[name]${hash}.js`,
            // 资源引用路径
            publicPath: conf.publicDir
        },

        resolve: {
            // 路径别名
            alias: {
                vue$: 'vue/dist/vue.runtime.esm.js',
                '@': Utils.resolve('/src'),
                '@c': Utils.resolve('/src/components')
            },
            extensions: ['.js', '.vue', '.json']
        },

        module: {
            rules: [
                // js、jsx文件
                {
                    test: /\.js[x]?$/,
                    use: ['cache-loader', 'babel-loader'],
                    include: Utils.resolve('/src')
                },

                // vue文件
                {
                    test: /\.vue$/,
                    use: ['cache-loader', 'vue-loader']
                },

                // 样式
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        {
                            loader: IsProd ? MiniCssExtractPlugin.loader : 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 3
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('dart-sass')
                            }
                        },
                        // 添加全局变量
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [Utils.resolve('/src/assets/styles/variable.scss')]
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },

                // 图片
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                                limit: 1024 * 10,
                                name: `img/[name]${hash}.[ext]`
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
                                limit: 1024 * 4,
                                name: `media/[name]${hash}.[ext]`
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
                                limit: 1024 * 4,
                                name: `fonts/[name]${hash}.[ext]`
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
                    NODE_ENV: JSON.stringify(conf.mode),
                    CONFIG_ENV: JSON.stringify(conf.configEnv)
                }
            }),

            // vue文件解析器
            new VueLoaderPlugin()
        ]
    };
};
