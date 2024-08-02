import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  //   input: './src/index.ts',
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  external: ['fast-deep-equal'],
});
