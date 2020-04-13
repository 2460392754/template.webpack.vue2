module.exports = {
    // 添加scss解析器(防止解析css中行内注释出现错误)
    parser: 'postcss-scss',

    plugins: [require('autoprefixer')]
};
