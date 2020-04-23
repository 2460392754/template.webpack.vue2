const { staging: ConfigStaging } = require('../config');
const Build = require('./build');

if (process.argv.length && process.argv[2].includes('build')) {
    process.argv = [];
    Build(ConfigStaging, [config, require('./conf.prod.js')]);
}

function config(conf) {
    return {
        devtool: conf.devtool
    };
}

module.exports = config;
