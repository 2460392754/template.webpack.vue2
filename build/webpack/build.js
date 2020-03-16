const Ora = require('ora');
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ConfigCommon = require('./conf.common');

const spinner = Ora(`webpack complie...`);
const smp = new SpeedMeasurePlugin();

module.exports = function(currrentConfig, webpackConfigList) {
    const fnList = [ConfigCommon, ...webpackConfigList];
    const ConfigList = fnList.map((fn) => fn.call(currrentConfig));
    const AfterConfig = WebpackMerge(ConfigList);

    spinner.start();

    Webpack(smp.wrap(AfterConfig), (err, stats) => {
        spinner.stop();

        if (err) throw err;
    });
};
