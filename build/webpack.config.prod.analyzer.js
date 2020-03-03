const WebpackMerge = require('webpack-merge');
const WebPackConfigProd = require('./webpack.config.prod');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { analyzer: ConfigAnalyzer } = require('./config');

module.exports = WebpackMerge(WebPackConfigProd, {
    mode: ConfigAnalyzer.mode,

    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: ConfigAnalyzer.pluginMode
        })
    ]
});
