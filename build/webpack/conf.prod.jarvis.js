const WebpackJarvis = require('webpack-jarvis');
const { jarvis: ConfigJarvis } = require('../config');
const Build = require('./build');

if (process.argv.length && process.argv[2].includes('build')) {
    process.argv = [];
    Build(ConfigJarvis, [config, require('./conf.prod.js')]);
}

function config(conf) {
    return {
        plugins: [
            new WebpackJarvis({
                watchOnly: conf.watchOnly
            })
        ]
    };
}

module.exports = config;
