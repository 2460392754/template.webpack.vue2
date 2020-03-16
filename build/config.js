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

    const config = {
        // dev
        dev: {
            mode: 'development',
            configEnv: 'dev',
            // devtool: 'cheap-module-eval-source-map',
            host: 'localhost',
            publicDir: '/',
            assetsDir: '/',
            port: 8080
        },

        // dll
        dll: {
            mode: 'production',
            dllDir: '/dll',
            dllVendor: ['vue/dist/vue.runtime.esm.js', 'vue-router', 'vuex', 'axios']
        },

        // prod
        prod: {
            publicDir: common.publicDir, // 加载cdn资源
            jsMap: false,
            cssMap: false
        },
        test: {
            configEnv: 'test',
            jsMap: true
        },
        analyzer: {
            pluginMode: 'static'
        },
        jarvis: {}
    };

    ['dev', 'prod'].forEach((key) => {
        config[key] = { ...common, ...config[key] };
    });

    ['test', 'analyzer', 'jarvis'].forEach((key) => {
        config[key] = { ...config.prod, ...config[key] };
    });

    return config;
})();
