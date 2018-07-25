const merge = require('webpack-merge');
const webpack = require('webpack')
const common = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
var path = require('path')
var Visualizer = require('webpack-visualizer-plugin');

module.exports = merge(common, {
    output: {
        publicPath: '/activities/doubleeggs/dist/'
    },
    plugins: [
        new CleanPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'LOG_ENV': JSON.stringify('GA')
            }
        }),
        new HtmlWebpackPlugin({
            inject: false,
            title: '网易漫画新年游园会',
            template: './src/index.ejs',
            filename: path.resolve(__dirname, '../../WEB-INF/template/wap/doubleeggs/index.ftl')
        }),
        new Visualizer({
            filename: './statistics.html'
        })
    ],
    module: {
        rules: [ {
            test: /\.(png|jpg|TTF|eot)$/, use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: '[name].[hash:8].[ext]',
                        prefix: "res/"
                    }
                },
                /*对图片进行压缩*/
                {
                    loader: 'image-webpack-loader',
                    options: {
                        optipng: {
                            optimizationLevel: 7,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        }
                    }
                }
            ]
        }]
    }
});
