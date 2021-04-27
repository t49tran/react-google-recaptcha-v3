const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');
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
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    sourceMaps(),
    terser()
  ]
};
