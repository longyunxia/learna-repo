const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const dirname = path.resolve(__dirname, '');

module.exports = {

    entry: {
        index: './src/index.js',
        vendor: ['react', 'react-dom', 'react-router-dom']
    },
    output: {
        path: path.join(dirname, 'dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    /*    resolve: {
     extensions: [' ', '*', '.js', '.jsx'],
     modules: [path.resolve(dirname),
     "node_modules", path.resolve(__dirname, "src/components"),]

     },*/
    plugins: [

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: '[name].[hash:8].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].[hash:8].js',
            minChunks: 2
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(css|scss)$/,
                exclude: [/node_modules/, /toast/],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader' /*,
                         options: {
                         sourceMap: true,
                         importLoaders: 1,
                         modules: true,
                         localIdentName: "[local]---[hash:base64:5]",
                         camelCase: true
                         }*/
                        },
                        {
                            loader: "sass-loader"
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer'),
                                        require('postcss-px2rem')({remUnit: 75})
                                    ];
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(css)$/,
                include: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        }
                    ]
                })
            }

        ]
    }
}
