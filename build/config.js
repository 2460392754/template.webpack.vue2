const portfinder = require('portfinder');

module.exports = (function() {
    const CDN = {
        use: false,
        domain: 'http://cdn.pocky.top'
    };

    this.common = {
        assetsDir: './assets/',
        publicDir: '/assets/'
    };

    this.dev = {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map',
        host: 'localhost',
        publicDir: '/',
        assetsDir: '/',
        port: 8080,
        jsMap: true
    };

    this.prod = {
        mode: 'production',
        devtool: '#source-map',
        publicDir: (CDN.use ? CDN.domain : '') + this.common.publicDir, // 加载cdn资源
        jsMap: false,
        cssMap: false
    };

    this.dll = {
        mode: 'production',
        dllDir: '../dll',
        dllVendor: ['vue/dist/vue.runtime.esm.js', 'vue-router']
    };

    this.analyzer = {
        mode: 'production',
        pluginMode: 'static'
    };

    return this;
})();
