var path = require("path");
var webpack = require("webpack");
module.exports = {
    cache: false,
    debug: true,
    devtool: false,
    stats: {
        colors: true,
        reasons: true
    },
    entry: {},
    output: {
        publicPath: '/assets/',
        path: 'dist/assets/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?limit=10000"
        }, {
            test: /\.scss/,
            loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader?outputStyle=expanded'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(jpg|png)$/,
            loader: "url-loader?limit=100000&minetype=image/png"
        }]
    },
    resolve: {
        root: [__dirname],
        extensions: ['', '.js', '.jsx'],
        alias: {
            react: 'react',
            _: 'lodash',
            "table-root": __dirname + "/node_modules/fixed-data-table"
        }
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'React']
            },
            compress: {
                warnings: false
            },
        }),
        // 针对react 优化
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
