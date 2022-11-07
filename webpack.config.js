const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const fs = require('fs')
const config = require('./.vmprc')

const root = path.resolve(__dirname)
const srcDir = path.resolve(root, 'src')
const distDir = path.resolve(root, 'dist')
const outputPublicPath = config.useOnePage ? '../' : '../../'

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
const modulesNeedBuild = modules
  .filter((module) => existedModules.indexOf(module) === -1)
  .concat(config.forceUpdate)

const assembleHtmlPlugins = (pages) => {
  const multipleHtmlPlugins = []

  if (config.useOnePage) {
    pages.forEach((page) => {
      multipleHtmlPlugins.push(
        new HtmlWebpackPlugin({
          title: `${page}`,
          template: 'index.html',
          filename: `./${page}/${page}.html`,
          chunks: [page],
        })
      )
    })
  } else {
    pages.forEach((page) => {
      config.languages.forEach((lang) => {
        multipleHtmlPlugins.push(
          new HtmlWebpackPlugin({
            title: `${page}-${lang}`,
            template: 'index.html',
            filename: `./${page}/${lang}/${page}.html`,
            chunks: [page],
            templateParameters: {
              useOnePage: config.useOnePage,
              lang,
            },
          })
        )
      })
    })
  }

  return multipleHtmlPlugins
}

const buildEntries = (pages) =>
  pages.reduce((prev, page) => {
    const entry = {
      import: `./src/${page}/index.js`,
      filename: `${page}/[name].[contenthash:8].js`,
    }
    return { ...prev, [page]: entry }
  }, {})

const multipleHtmlPlugins = assembleHtmlPlugins(modulesNeedBuild)
const entries = buildEntries(modulesNeedBuild)

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: entries,
  output: {
    path: distDir,
    publicPath: outputPublicPath,
    assetModuleFilename: (data) => data.filename.replace('src/', ''),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]],
        },
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
  },
  plugins: [...multipleHtmlPlugins, new VueLoaderPlugin()],
}
