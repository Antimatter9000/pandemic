const path = require('path');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: __dirname,
    mode: process.env.NODE_ENV || 'development',

    entry: './src/index.js',

    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js'
    },

    devServer: {
        port: 9000
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

    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },

    // plugins: [
    //   new MiniCssExtractPlugin({
    //     filename: `styles/[name].css`
    //   })
    // ]
}