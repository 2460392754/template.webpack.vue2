const merge = require('deepmerge');

// 代码编译时的运行环境
const env = process.env.CONFIG_ENV || process.argv[2].replace('--', '');
const common = require('./common');
let data = {};

try {
    data = require(`./${env}.js`);
} catch (e) {
    data = require(`./prod.js`);
}

module.exports = merge(common, data);
