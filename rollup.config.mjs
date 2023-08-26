import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

//
//

const sourceMap = false;

//
//

function getConfig(dev = false, server = false) {
  let file = '';

  if (dev && server) {
    file = './dist/server.dev.js';
  }
  if (dev && !server) {
    file = './dist/index.dev.js';
  }
  if (!dev && server) {
    file = './dist/server.js';
  }
  if (!dev && !server) {
    file = './dist/index.js';
  }

  return {
    input: './src/index.ts',
    output: {
      file,
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

        define: {
          __DEV__: dev + '',
          __SERVER__: server + '',
        },
      }),
    ],
  };
}

//
//

export default [
  getConfig(false, false),
  getConfig(false, true),
  getConfig(true, false),
  getConfig(true, true),
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
