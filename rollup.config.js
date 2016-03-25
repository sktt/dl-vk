import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/content.js',
  format: 'iife',
  plugins: [ nodeResolve({
    jsnext: true,
    main: true })
  ],
  dest: 'dist/content.js'
}
