const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { analyzer: ConfigAnalyzer } = require('../config');
const Build = require('./build');

if (process.argv.length && process.argv[2].includes('build')) {
    process.argv = [];
    Build(ConfigAnalyzer, [config, require('./conf.prod.js')]);
}

function config() {
    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: this.pluginMode
            })
        ]
    };
}

module.exports = config;
