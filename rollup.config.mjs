import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

//
//

const sourceMap = false;

//
//

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'es',
      sourcemap: sourceMap,
    },
    external: ['fast-deep-equal'],
    watch: {
      clearScreen: false,
      include: 'src/**',
    },
    plugins: [
      //
      //  Transpile the typescript
      esbuild({
        sourceMap,
        minify: false,
      }),
    ],
  },
  //
  // Types
  {
    input: './dist/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts(), replaceThis()],
  },
];

//
//

function replaceThis() {
  return {
    name: 'replace-this-plugin',
    renderChunk(code) {
      // Substitui todas as ocorrências de `this$1` por `this`
      const modifiedCode = code.replace(/this\$1;/g, 'this;');
      return {
        code: modifiedCode,
        map: null,
      };
    },
  };
}
