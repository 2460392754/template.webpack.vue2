const { test: ConfigTest } = require('../config');
const Build = require('./build');

if (process.argv.length && process.argv[2].includes('build')) {
    process.argv = [];
    Build(ConfigTest, [config, require('./conf.prod.js')]);
}

function config() {
    return {
        devtool: this.devtool
    };
}

module.exports = config;
