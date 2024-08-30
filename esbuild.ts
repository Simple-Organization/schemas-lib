import * as esbuild from 'esbuild';
import { fixClassNamesPlugin } from 'esbuild-utils';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  plugins: [fixClassNamesPlugin()],
});
