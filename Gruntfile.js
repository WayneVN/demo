'use strict';
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackServerConfig = require('./webpack.config.server.js');
var path = require('path');
var _ = require('lodash');
var proxyConfig = {};
var PROXY_PORT = process.env.PORT || 8808;
var reqs = require('./mock/main');
var webpackReleaseConfig = _.cloneDeep(webpackConfig);
var fs = require('fs');
var CDN_PATH = '';

module.exports = function(grunt) {

    initProxyConfig();
    var webpackOption = getWebpackOption();

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        connect: {
            server: {
                options: {
                    port: PROXY_PORT,
                    hostname: 'localhost',
                    keepalive: true,
                    base: './dist/',
                    debug: true,
                    middleware: function(connect, options, middlewares) {
                        // 伪造ajax数据
                        middlewares.unshift(require('./grunt/mock')(grunt));

                        return middlewares;
                    }
                }
            }
        },

        "webpack-dev-server": {
            options: {
                hot: true,
                port: 3000,
                host: '0.0.0.0',
                webpack: webpackServerConfig,
                historyApiFallback: true,
                noInfo:false,
                hot: true,
                publicPath: '/',
                contentBase: './dist/',
                proxy: proxyConfig

            },
            start: {
                keepAlive: true,
                // webpack: {
                //  devtool: "eval",
                //  debug: true
                // }
            }

        },

        watch: {
            options: {
                nospawn: true
            },
            html: {
                files: ['app/page/**/*.html'],
                tasks: ['copy']
            },
            js: {
                files: [
                    'app/scripts/**/*.**',
                    'app/style/**/*.**',
                    'app/script/**/*.**',
                    'app/style/**/*.**'
                ],
                tasks: ['webpack']
            }
        },
        
        webpack: webpackOption,
        clean: {
            options: {
                force: true
            },
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/page',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '{,*/**/}*.html',
                    ]
                }]
            },
            index: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/page',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'index.html',
                    ]
                }]
            } ,
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        'images/{,*/**/}*.*',
                        'lib/{,*/**/}*.*',
                        'tools/{,*/**/}*.*'
                    ]
                }]
            },
        },
        replace: {
            html: {
                options: {
                    patterns: [
                        {
                            match: /assets/g,
                            replacement: CDN_PATH + '/assets'
                        }
                    ]
                },
                files: [
                    {
                        dest: './',
                        src: 'dist/index.html'
                    }
                ]
            },
            js: {
                options: {
                    patterns: [
                        {
                            match: /(\.\.\/)+images/g,
                            replacement: CDN_PATH + '/images'
                        }
                    ]
                },
                files: [
                    {
                        dest: './',
                        src: 'dist/assets/*.js'
                    }
                ]
            },
            js2: {
                options: {
                    patterns: [
                        {
                            match: /\.\/images/g,
                            replacement: CDN_PATH + '/images'
                        }
                    ]
                },
                files: [
                    {
                        dest: './',
                        src: 'dist/assets/*.js'
                    }
                ]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'copy:index',
        'webpack',
    ]);

    grunt.registerTask('build_release', [
        'clean:dist',
        'copy:dist',
        'copy:index',
        'webpack',
    ]);

    grunt.registerTask('build_cdn', [
        'clean:dist',
        'copy:dist',
        'copy:index',
        'webpack:cdn',
        'replace:js',
        'replace:js2'
    ]);

    grunt.registerTask('default', 'build');

    grunt.registerTask('server', function (name) {
        if (name) {
            grunt.config.data.webpack = getWebpackOption(name);
        }

        grunt.task.run([
            'clean:dist',
            'copy',
            'webpack'
        ])
    });

    grunt.registerTask('dowatch', function (name) {
        if (name) {
            grunt.config.data.webpack = getWebpackOption(name);
        }

        grunt.task.run(['watch']);
    });

    grunt.registerTask('hotServer', function (name) {
        if (name) {
            grunt.config.data['webpack-dev-server'].options.webpack.entry = [
                'webpack/hot/only-dev-server',
                './app/script/entry/' + name + '.jsx'
            ];
            grunt.config.data['webpack-dev-server'].options.webpack.output.filename = './assets/' + name + '.js';
        }
        grunt.task.run(['webpack-dev-server']);
    });

};


function setWebpackConfig() {
    webpackConfig.plugins.splice(1, 2,
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("developer")
            }
        })
    );
}

function getWebpackOption(filename) {
    if (process.env.NODE_ENV != 'production') {
        setWebpackConfig();
    }

    // 打包所有文件
    var result = {};
    var dir = './app/script/entry';
    var files = fs.readdirSync(dir);

    _.forEach(files, function (file) {
        if (file.split('.')[1] == 'jsx') {
            var option = _.cloneDeep(webpackConfig);
            var name = file.split('.')[0];
            if (!filename || filename == name) {
                option.entry[name] = dir + '/' + file;
                result[name] = option;
            }
        }
    })

    return result;
}


function initProxyConfig() {
    var key = '';

    for (var k in reqs.response) {
        key = k.split('_').join('/');
        proxyConfig[key] = 'http://localhost:' + PROXY_PORT;
    }
}
