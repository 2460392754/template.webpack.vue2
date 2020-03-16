const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const WebpackMerge = require('webpack-merge');
const ConfigCommon = require('./conf.common');

module.exports = function(currrentConfig, webpackConfigList) {
    const fnList = [ConfigCommon, ...webpackConfigList];
    const ConfigList = fnList.map((fn) => fn.call(currrentConfig));
    const AfterConfig = WebpackMerge(ConfigList);

    const compiler = Webpack(AfterConfig);
    const server = new WebpackDevServer(compiler, AfterConfig.devServer);

    server.listen(AfterConfig.devServer.port, (err) => {
        if (err) throw err;
    });
};
