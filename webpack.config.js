const path = require('path');
const webpack = require('webpack');
var package = require('./package.json');
var env = process.env.NODE_ENV === undefined ? require('./environments/development.json') : require(`./environments/${process.env.NODE_ENV}.json`);
var sourcePath = path.join(__dirname, './src');

module.exports = {
    context: sourcePath,
    mode: 'development',        // show bug theo mỗi file
    // devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    target: 'web',
    entry: {
        main: [                 // gộp 2 file js -> main.js
            './src/index.js',
            './src/uuu.js'
        ],
    },
    output: {                   // file name
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')   //output in folder 'dist'
    },
    // optimization: {         //default Code Splitting "https://github.com/webpack/webpack.js.org/blob/e34b99fbc466cf29cb849488b43efbb428b73ec6/src/content/plugins/split-chunks-plugin.md"
    //     splitChunks: {
    //         chunks: 'async',   // all | async || initial (chunks nào được chọn để tối ưu)
    //         minSize: 20000,     // tính bằng byte, để tạo 1 đoạn dữ liệu
    //         minRemainingSize: 0,
    //         maxSize: 0,
    //         minChunks: 1,       // module shared min 1
    //         maxAsyncRequests: 30,       // requests async max 30
    //         maxInitialRequests: 30,     // requests // tại 1 điểm vào max 30
    //         enforceSizeThreshold: 50000,
    //         hidePathInfo: true,     // Ngăn lộ đường dẫn khi tạo fileName shared by maxSize 
    //         automaticNameDelimiter: '~',     // đánh dấu tên tự động (e.g. vendors~main.js)
    //         cacheGroups: {          // use [\\/] thể hiện dấu tách đường dẫn,  \ or / cause issue when use cross-flatform
    //             defaultVendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10,
    //                 reuseExistingChunk: true
    //             },
    //             default: {
    //                 minChunks: 2,
    //                 priority: -20,
    //                 reuseExistingChunk: true
    //             }
    //         }
    //     }
    // },
    optimization: {         //Code Splitting chia nhỏ file (webpack's automatic deduplication algorithm)
        splitChunks: {
            chunks: 'all',
            name: true,
            // cacheGroups: {
            //     commons: {
            //       chunks: 'initial',
            //       minChunks: 2
            //     },
            //     vendors: {
            //       test: /[\\/]node_modules[\\/]/,
            //       chunks: 'all',
            //       filename: isProduction ? 'vendor.[contenthash].js' : 'vendor.[hash].js',
            //       priority: -10
            //     }
            // }
        }
    },
    devServer: {
        contentBase: sourcePath,
        static: {
            directory: path.join(__dirname, 'dist')
        }
    },
    plugins: [                  // import library in the file js
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        mainFields: ['module', 'browser', 'main'],
        // fix issues Alias https://stackoverflow.com/questions/47863102/eslint-error-showing-with-webpack-alias
        alias: {        //import Menu from '@components/Menu'
            components: path.resolve(__dirname, "src/components/"),
        },
    },
    module: {           //babel load
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },

        {
            test: /\.(png|jpg|gif)$/i,
            type: 'asset/inline',            //Asset Modules Inline giúp chúng ta mã hóa hình ảnh thành chuỗi base64 URIs
            parser: {
                dataUrlCondition: {
                    maxSize: 8 * 1024       // max 8KB, nếu vượt qua 8kb, webpack sd file-loader
                }
            },
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'      //in folder dist src/assets/images
                    }
                }
            ]
        },
        // css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // less
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              },
              sourceMap: true
            }
          }
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
          GATEWAY_URL: env.GATEWAY_URL,
          BASE_URL_WORKFLOW_WEB: env.BASE_URL_WORKFLOW_WEB,
          BASE_URL_EFORM_WEB: env.BASE_URL_EFORM_WEB,
          AUTH_CODE: env.AUTH_CODE,
          ENCODE_KEY: env.ENCODE_KEY,
          EVA_API_URL: env.EVA_API_URL,
          EVA_PO_API_URL: env.EVA_PO_API_URL,
          SM_URL: env.SM_URL,
          SWW_API: env.SWW_API,
          DEBUG: false
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: '[hash].css',
          disable: !isProduction
        }),
        new HtmlWebpackPlugin({
          template: 'assets/index.html',
          minify: {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            useShortDoctype: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true
          },
          append: {
            head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`
          },
          meta: {
            title: package.name,
            description: package.description,
            keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined
          }
        })
      ],
    // node: {
    //     // workaround for webpack-dev-server issue
    //     // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    //     fs: 'empty',
    //     net: 'empty'
    // }
}
