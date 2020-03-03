const IsProd = process.env.NODE_ENV === 'production';
const plugins = [];

if (IsProd) {
    // 删除 console.log
    plugins.push([
        'transform-remove-console',
        {
            exclude: ['error', 'warn']
        }
    ]);
}

module.exports = {
    presets: ['@babel/preset-env'],
    plugins
};
