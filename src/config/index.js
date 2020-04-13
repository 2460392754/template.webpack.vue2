const NODE_ENV = process.env.CONFIG_ENV;

export default {
    ...require('./common.js').default,
    ...require(`./${NODE_ENV}.js`).default
};
