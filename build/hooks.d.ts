import { compilation } from 'webpack';

interface IOpts extends compilation.CompilerHooks {}

export class Hooks {
    constructor(opts: compilation.CompilerHooks);
}

export = Hooks;
