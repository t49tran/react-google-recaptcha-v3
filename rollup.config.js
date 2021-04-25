import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    { file: `dist/${pkg.name}.esm.js`, format: 'es', sourcemap: true },
    { file: `dist/${pkg.name}.cjs.js`, format: 'cjs', sourcemap: true }
  ],
  external: Object.keys(pkg.peerDependencies),
  watch: {
    include: 'src/**'
  },
  plugins: [commonjs(), nodeResolve(), typescript(), sourceMaps(), terser()]
};
