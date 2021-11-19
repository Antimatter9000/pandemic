const path = require('path');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: __dirname,
    mode: process.env.NODE_ENV || 'development',

    entry: {
        pandemic: './src/index.js'
    },

    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].js',
        publicPath: 'public'
    },

    devServer: {
        port: 4001
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: ['css-loader', 'sass-loader']
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'src'),
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env"
                    ],
                }
            }
        }],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                }
            }
        }
    },
}