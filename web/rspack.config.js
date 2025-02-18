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
      main: './src/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist/assets'),
      filename: '[name].[contenthash].bundle.js',
    },
    devtool: isDev ? 'source-map' : 'eval',
    devServer: {
      port: 5000,
      client: {
        progress: true,
        overlay: true,
      },
    },
    resolve: {
      extensions: ['...', '.tsx', '.ts', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
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
      ],
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
  }
})