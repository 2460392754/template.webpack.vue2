module.exports = class Hooks {
    /**
     * 钩子列表
     * ``` js
     * new Hooks ({
     *     done (statsData) { }
     * });
     * ```
     * @param {*} hooks
     */
    constructor(hooks) {
        this.hooks = hooks;
    }

    apply(compiler) {
        for (const [hookName, callback] of Object.entries(this.hooks)) {
            compiler.hooks[hookName].tap('myHook', callback);
        }
    }
};
