const Chalk = require('chalk');
const Ora = require('ora');

module.exports = class Hooks {
    constructor(hooks) {
        this.hooks = hooks;
        this.spinner = null;
    }

    apply(compiler) {
        for (const [hookName, callback] of Object.entries(this.hooks)) {
            compiler.hooks[hookName].tap('myHook', callback);
        }
    }

    spinnerStart(msg) {
        this.spinner = Ora(msg).start();
    }

    spinnerStop() {
        this.spinner.stop();
    }

    log(msg) {
        console.log(Chalk.blue(msg));
    }
};
