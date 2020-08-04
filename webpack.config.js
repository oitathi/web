const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("process.env.NODE_ENV",process.env.NODE_ENV)
module.exports = {
    //entry: './src/client/index.js',
    mode: 'development',
    entry: {
        index: ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000", "./src/client/index.js"]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle.[contenthash].js',
        filename: 'bundle_[hash].js',
        publicPath: '/'
    },
    // devServer: {
    //     contentBase: './dist',
    //     hot: true
    // },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
                        plugins: ['@babel/proposal-class-properties', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-syntax-dynamic-import']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            // {
            //     test: /\.json$/,
            //     use: ['json-loader']
            // }
        ]
    },
    externals: {
        'config': JSON.stringify(process.env.NODE_ENV === 'production' ? require('./src/config/production.json') : require('./src/config/develop.json'))
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            // filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
