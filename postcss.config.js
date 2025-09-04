export default {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};