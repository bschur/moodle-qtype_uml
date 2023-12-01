import {build} from 'esbuild';

await build({
    entryPoints: ['./editor/uml-editor-initializer.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2017',
    logLevel: 'error',
    outfile: './editor/dist/uml-editor-initializer.min.js',
});