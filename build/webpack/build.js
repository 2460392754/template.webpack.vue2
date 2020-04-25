const Webpack = require('webpack');
const Ora = require('ora');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// console.log(require('../../config'));

/**
 * 生产环境
 * @param {Object} config webpac配置数据
 */
module.exports = function(config) {
    const spinner = Ora(`webpack编译中...`);
    const smp = new SpeedMeasurePlugin();

    // 开始运行命令行加载动画
    spinner.start();

    // 运行webpack
    Webpack(smp.wrap(config), (err, stats) => {
        spinner.stop();

        if (err) throw err;
    });
};
