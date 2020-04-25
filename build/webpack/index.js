const Chalk = require('chalk');
const WebpackMerge = require('webpack-merge');

// 获取运行环境
const env = process.argv[2].replace('--', '');

console.log(Chalk.blue('\n--- webpack代码编译 ---'));
console.log(Chalk.blue(`--- 运行环境: ${env} ---\n`));

// 获取当前运行环境的配置数据
const ConfigData = require('../config/index.js')[env];

// 配置函数列表
const funcList = [require('../config/common.js')];

// 处理每个环境
switch (env) {
    case 'dev':
        funcList.push(require('../config/dev.js'));
        break;

    case 'prod':
    case 'localhost':
    case 'staging':
    case 'analyzer':
        funcList.push(require('../config/prod.js'));
}

// 获取webpack数据
const ConfigList = funcList.map((fn) => fn(ConfigData));

// webpack数据合并
const mergeConfig = WebpackMerge(ConfigList);

// console.log(mergeConfig);

// 获取当前运行的服务
const service = require(env === 'dev' ? './server' : './build');

// 开始运行webpack
service(mergeConfig);
