const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

/**
 * 开发环境
 * @param {Object} config webpac配置数据
 */
module.exports = function(config) {
    const compiler = Webpack(config);
    const server = new WebpackDevServer(compiler, config.devServer);

    // 监听文件变化
    server.listen(config.devServer.port, (err) => {
        if (err) throw err;
    });
};
