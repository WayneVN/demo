var path = require("path");
var webpack = require("webpack");



module.exports = {
    cache: true,
    debug: true,
    stats: {
        colors: true,
        reasons: true
    },
    devtool: 'source-map',
    entry: [
        'webpack/hot/only-dev-server',
        './app/script/entry/index.jsx'
    ],
    output: {
        filename: './assets/index.js'
    },
    module: {
        noParse: [
            /moment-with-locales/,
        ],
        loaders: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'react-hot!babel-loader'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=100000&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg|swf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
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
            },

            // {test: require.resolve('jquery'), loader: 'expose?jQuery'},
        ]
    },
    resolve: {
        root: [path.join(__dirname, "/app/scripts")],
        extensions: ['', '.js', '.jsx'],
        alias: {
            react: 'react',
            _: 'lodash',
            $: 'jquery',
            moment: 'moment/min/moment-with-locales.min.js',
            "table-root": __dirname + "/node_modules/fixed-data-table"
                // pdfWork: 'pdfjs-dist/build/pdf.worker.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("developer")
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]

};
