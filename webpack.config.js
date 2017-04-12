var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var ENV = process.env.NODE_ENV;
var isDev = ENV === 'dev';

var tPages = fs.readdirSync(path.join(__dirname, './src/tourist/pages')),
    aPages = fs.readdirSync(path.join(__dirname, './src/admin/pages'));

var configArr = [];

addConfig(tPages, 'tourist');
addConfig(aPages, 'admin');

function addConfig(arr, dir) {
    var config = {
        devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
        entry: [path.join(__dirname, './src/'+ dir +'/main.js')],
        output: {
            path: path.join(__dirname, 'public/'+ dir),
            publicPath: '/'+ dir + '/',
            filename: 'js/[name].[hash:8].js'
        },
        plugins: [
            new webpack.DefinePlugin({
                'ENV': JSON.stringify(ENV)
            }),
            new CleanWebpackPlugin(['public/*', 'views/*']),
            new ExtractTextPlugin({
                filename: 'styles/app.[hash:8].css',
                allChunks: !isDev
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    htmlLoader: {
                        ignoreCustomFragments: [/\{\{.*?}}/],
                        attrs: ['img:src', 'link:href']
                    }
                }
            })

        ],
        module: {
            rules: [
                {
                    test: /.html$/,
                    use: ['html-loader']
                }, {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader?minimize='+ !isDev, 'postcss-loader']
                    })
                }, {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader?minimize='+ !isDev, 'postcss-loader', 'sass-loader']
                    })
                }, {
                    test: /\.(png|jpg)$/,
                    use: 'url-loader?limit=8192&name=imgs/[name].[hash:8].[ext]'
                }, {
                    test: /\.(woff2?|svg)$/,
                    loader: 'url-loader?limit=10000&name=fonts/[name].[hash:8].[ext]'
                }, {
                    test: /\.(ttf|eot)$/,
                    loader: 'file-loader?name=fonts/[name].[hash:8].[ext]'
                }
            ]
        }
    };

    arr.forEach(function(page) {
        var conf = {
            alwaysWriteToDisk: true,
            filename: path.join(__dirname, './views/'+ dir +'/'+ page + '.html'),
            template: path.join(__dirname, './src/'+ dir +'/pages/'+ page + '/'+ page + '.html'),
            inject: false
        };
        config.plugins.push(new HtmlWebpackPlugin(conf));
    });

    config.plugins.push(new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: path.join(__dirname, './views/'+ dir +'/index.html'),
        template: path.join(__dirname, './src/'+ dir +'/index.html'),
        inject: 'body'
    }));


    if(ENV === 'dev') {
        // dev环境
        config.plugins.push(new HtmlWebpackHarddiskPlugin());
    } else {
        // build环境
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize: true,
            sourceMap: true
        }));
    }

    configArr.push(config);
}

module.exports = configArr;