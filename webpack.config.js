const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

const root = path.resolve(__dirname)
const srcDir = path.resolve(root, 'src')
const distDir = path.resolve(root, 'dist')
const languages = ['en', 'pt', 'es']

const getModules = (modulePath) => {
  if (fs.existsSync(modulePath)) {
    const paths = fs.readdirSync(modulePath)

    return paths.filter((filePath) => {
      const fsStat = fs.lstatSync(path.resolve(modulePath, filePath))
      return fsStat.isDirectory()
    })
  }

  return []
}

const modules = getModules(srcDir)
const existedModules = getModules(distDir)
const modulesNeedBuild = modules.filter((module) => existedModules.indexOf(module) === -1)

const assembleHtmlPlugins = (pages) => {
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
  return multipleHtmlPlugins
}

const buildEntries = (pages) =>
  pages.reduce((prev, cur) => {
    const entry = {
      import: `./src/${cur}/index.js`,
      filename: `${cur}/${cur}.[contenthash:8].js`,
    }
    return { ...prev, [cur]: entry }
  }, {})

const multipleHtmlPlugins = assembleHtmlPlugins(modulesNeedBuild)
const entries = buildEntries(modulesNeedBuild)

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: entries,
  output: {
    path: distDir,
    publicPath: '../',
    clean: true,
  },
  module: {},
  plugins: [...multipleHtmlPlugins],
}
