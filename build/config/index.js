const conf = require('../../config');
const merge = require('deepmerge');

module.exports = (function() {
    // 默认配置
    const common = {
        // 生成的资源文件路径
        assetsDir: './assets/',

        // 资源引用路径
        publicDir: '/assets/',

        // 环境变量：运行环境
        mode: 'production',

        // 环境变量：配置环境
        configEnv: 'prod',

        // 生成js源码映射的类型
        devtool: 'source-map',

        // js 源码映射
        jsMap: false,

        // css 源码映射
        cssMap: false,

        // webpack编译代码生成 '代码依赖分析'
        stats: false,

        // 前端监控
        sentry: false,

        // gzip资源压缩
        gzip: false
    };

    // cdn配置
    const CDN = {
        use: true,
        domain: conf.qiniu.domain
    };

    const config = {
        // 开发环境
        dev: {
            // common
            mode: 'development',
            configEnv: 'dev',
            host: 'localhost',
            publicDir: '/',
            assetsDir: '/',
            jsMap: true,
            cssMap: true,

            // dev-server
            port: 8080,
            open: false,
            proxyUrl: conf.proxyUrl
        },

        // 生产环境
        prod: {
            publicDir: (CDN.use ? CDN.domain : '') + common.publicDir, // 加载cdn资源
            jsMap: true,
            sentry: true
        },

        // 预生产环境
        staging: {
            configEnv: 'staging',
            publicDir: (CDN.use ? CDN.domain : '') + common.publicDir, // 加载cdn资源
            jsMap: true,
            sentry: true
        },

        // 本地预览的生产环境
        localhost: {
            configEnv: 'localhost',
            jsMap: true,
            cssMap: true
        },

        // 查看生产代码分析环境
        analyzer: {
            configEnv: 'analyzer',
            pluginMode: 'static'
        }
    };

    ['dev', 'prod', 'staging', 'localhost', 'analyzer'].forEach((key) => {
        config[key] = merge(common, config[key]);
    });

    return config;
})();
