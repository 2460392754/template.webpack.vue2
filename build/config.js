module.exports = (function a() {
    const common = {
        assetsDir: './assets/',
        publicDir: './assets/',
        mode: 'production',
        configEnv: 'prod',
        devtool: 'source-map',
        jsMap: true,
        cssMap: true
    };

    const CDN = {
        use: false,
        domain: 'http://cdn.pocky.top'
    };

    const config = {
        // 开发环境
        dev: {
            mode: 'development',
            configEnv: 'dev',
            host: 'localhost',
            publicDir: '/',
            assetsDir: '/',
            port: 8080,
            open: false
        },

        // 生产环境
        prod: {
            publicDir: (CDN.use ? CDN.domain : '') + common.publicDir, // 加载cdn资源
            jsMap: false,
            cssMap: false
        },
        // 预生产环境
        staging: {
            configEnv: 'staging',
            jsMap: true
        },
        analyzer: {
            pluginMode: 'static'
        },
        jarvis: {
            watchOnly: false
        }
    };

    ['dev', 'prod'].forEach((key) => {
        config[key] = { ...common, ...config[key] };
    });

    ['staging', 'analyzer', 'jarvis'].forEach((key) => {
        config[key] = { ...config.prod, ...config[key] };
    });

    return config;
})();
