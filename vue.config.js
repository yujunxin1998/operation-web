const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const CompressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}
const isLib = process.env.VUE_APP_KFROM_LIB
// vue.config.js
const vueConfig = {
  parallel: false,
  publicPath: process.env.VUE_APP_APPLICATION_URL,
  outputDir: process.env.VUE_APP_OUTPUT_DIR,
  configureWebpack: {
    target: 'web', // Ensure it's targeting the web for browser usage
    output: {
      library: 'MyLibrary', // This will expose your library globally (e.g. window.MyLibrary)
      libraryTarget: 'umd', // UMD format to work with both Node.js and browser
      globalObject: 'this' // Ensure the library works in both environments
    },
    // webpack plugins
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ],
    externals: isLib ? {
      vuedraggable: 'vuedraggable'
    } : {},
    node: {
      // Allow the usage of Node.js built-ins (like `require`)
      fs: 'empty',
      module: 'empty',
      child_process: 'empty'
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false
        }))
    }

    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // Match modules from node_modules
          priority: -10,
          name (module) {
            const matches = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
            if (matches && matches.length > 1) {
              const packageName = matches[1]
              return `npm.${packageName.replace('@', '')}`
            } else {
              return 'npm.vendors'
            }
          }
        }
      }
    })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
		// less vars，customize ant design theme
          'primary-color': '#356CEB',
          'primary-color-light': '#D4E7FE',
          'link-color': '#356CEB',
          'layout-color': '#0052d9',
          'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/diit-project': {
        target: 'http://192.168.60.15:31434',
        changeOrigin: true
      },
      '/diit-operation': {
        target: 'http://192.168.60.105:8080/auth',
        changeOrigin: true
      },
      '/diit-file': {
        target: 'http://192.168.60.15:31434',
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: undefined,
  transpileDependencies: []
}

// For preview only, do not use in production
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // Add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
