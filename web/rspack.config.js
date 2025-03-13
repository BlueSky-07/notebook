import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rspack/cli'
import { rspack } from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig((env, argv) => {
  const isDev = env.production
  return {
    target: 'web',
    entry: {
      index: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].bundle.js',
      chunkFilename: '[id].[contenthash].chunk.js',
      cssChunkFilename: '[id].[contenthash].chunk.css',
      clean: true
    },
    devtool: isDev ? 'source-map' : 'eval',
    devServer: {
      port: 9000,
      client: {
        progress: true,
        overlay: true,
      },
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:9001',
          pathRewrite: { '^/api': '/' },
        },
      ],
    },
    resolve: {
      extensions: ['...', '.tsx', '.ts', '.jsx'],
      alias: {
        "@assets": path.resolve(__dirname, 'assets'),
        "@api": path.resolve(__dirname, 'api-generated'),
        "@": path.resolve(__dirname, 'src'),
      }
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  jsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic'
                  },
                },
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'less-loader',
            },
          ],
          type: 'css/auto',
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
      ],
      parser: {
        'css/auto': {
          namedExports: false,
        },
      },
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: 'src/index.ejs',
        title: "Notebook",
        minify: true,
      }),
      isDev && new ReactRefreshPlugin(),
      isDev && new rspack.HotModuleReplacementPlugin(),
    ],
    experiments: {
      css: true,
    },
  }
})