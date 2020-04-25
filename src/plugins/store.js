import vue from 'vue';
import vuex from 'vuex';

vue.use(vuex);

const modules = {};

// 自动遍历加载根目录下的`store`目录下的`.js`结尾的文件
// const componentsContext = require.context('@/store', true, /\.js$/);

// // 遍历'store'目录下的文件, 动态加载
// componentsContext.keys().forEach((path) => {
//     const res = componentsContext(path).default;
//     const moduleName = nameFormat(path);

//     modules[moduleName] = res;
// });

/**
 * 路径转名称
 * './modules/user.js' => 'user'
 * @param {string} name
 * @returns {string}
 */
function nameFormat(name) {
    return name.match(/^.\/(\S+).js$/)[1];
}

export default new vuex.Store({
    // 非生产环境开启严格模式
    strict: process.env.NODE_ENV !== 'production',

    modules
});
