const merge = require('webpack-merge');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.config.js');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        inline: false,
        disableHostCheck: true,
        proxy: [{
            context: ["/user/**"],
            target: "http://dev.manhua.163.com/",
            changeOrigin: true
        }, {
            context: ["/target/**", "/ws/**"],
            target: "http://localhost:8082",
            changeOrigin: true
        }],
        historyApiFallback: true,
        historyApiFallback: {
            rewrites: [
                {from: /^\/$/, to: '/index.html'}
            ]
        },

        host: '0.0.0.0',

        hotOnly: false,
        headers: {"Access-Control-Allow-Origin": "*"},
        // enable HMR on the server
        hot: false,
        compress: true,
        port: 8081
    },
    output: {
        publicPath: '/',

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            title: 'demo',
            template: './src/index.ejs',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'LOG_ENV': JSON.stringify('ST')
            }
        })],
    module: {
        rules: [{
            test: /\.(png|jpg|TTF|eot)$/, use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: '[name]-[hash:5].[ext]',
                        prefix: "res/"
                    }
                }
            ]
        }]
    }
});
