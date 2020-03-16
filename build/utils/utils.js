const Path = require('path');

/**
 * 获取项目目录下的相对路径
 * @param {string[]} relativePath 多路径
 * @returns {string} 多路径拼接后的绝对路径
 */
exports.resolve = function(...relativePath) {
    const joinPath = Path.join.apply(null, relativePath);
    const fullPath = Path.resolve(__dirname, `../../${joinPath}`);

    // console.log('\n');
    // console.log('--- relativePath ---', relativePath);
    // console.log('--- joinPath ---', joinPath);
    // console.log('--- fullPath ---', fullPath);
    // console.log('\n');

    return fullPath;
};
