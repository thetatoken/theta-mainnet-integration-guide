import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';
import json from 'rollup-plugin-json';


export default [
    // browser-friendly UMD build
    {
        input: 'src/index.js',
        output: {
            name: 'thetajs',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
            json({}),
            replace({
                delimiters: ['<@', '@>'],
                //Variables to replace
                PACKAGE_VERSION: pkg.version
            }),
            resolve({
                module: true, // Default: true
                main: true,  // Default: true
                browser: true,  // Default: false
            }), // so Rollup can find `ms`
            commonjs({
                // non-CommonJS modules will be ignored, but you can also
                // specifically include/exclude files
                include: [ "node_modules/**" ], // Default: undefined

                // if true then uses of `global` won't be dealt with by this plugin
                ignoreGlobal: false, // Default: false

                // if false then skip sourceMap generation for CommonJS modules
                sourceMap: false // Default: true
            }) // so Rollup can convert `ms` to an ES module

        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/index.js',
        //external: ['bignumber.js', 'rlp', 'secp256k1'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ]
    }
];
