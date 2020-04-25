// 自动遍历加载`global`目录下的`.js`结尾的文件
const componentsContext = require.context('./global', true, /\.js$/);

componentsContext.keys().forEach((component) => {
    componentsContext(component);
});
