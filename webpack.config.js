const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pages = ['page1', 'page2']
const languages = ['en', 'pt', 'es']
const multipleHtmlPlugins = []
pages.forEach((name) => {
  languages.forEach((lang) => {
    multipleHtmlPlugins.push(
      new HtmlWebpackPlugin({
        title: `${name}-${lang}`,
        template: 'index.html',
        filename: `./${name}/${lang}/${name}.html`,
        chunks: [name],
      })
    )
  })
})
const entries = pages.reduce((prev, cur) => {
  const entry = {
    import: `./src/${cur}/index.js`,
    filename: `${cur}/${cur}.bundle.js`,
  }
  return { ...prev, [cur]: entry }
}, {})

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '../',
  },
  module: {},
  plugins: [...multipleHtmlPlugins],
}
