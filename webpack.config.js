var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var dotenv = require('dotenv')

dotenv.config()

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: './client/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'client')
            }
        ]
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/graphql': 'http://localhost:4000/graphql'
        }
    }
}
