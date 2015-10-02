'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble' );

    var projectConfig  = grunt.file.readJSON('data.json');
    projectConfig.src  = 'src';
    projectConfig.dist = 'dist';

    grunt.initConfig({

        config: projectConfig,

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            assemblePages: {
                files: ['<%= config.src %>/pages/{,*/}*.hbs'],
                tasks: ['newer:assemble', 'copy:html']
            },
            assembleTemplate: {
                files: ['<%= config.src %>/templates/**/*.hbs','data.json'],
                tasks: ['assemble', 'copy:html']
            },
            coffee: {
                    files: ['<%= config.src %>/coffee/{,*/}*.coffee'],
                    tasks: ['coffee:dist']
            },
            images: {
                files: ['<%= config.src %>/img/{,*/}*.{jpg,jpeg,png,gif,webm}'],
                tasks: ['newer:copy:img']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= config.dist %>/**/*'
                ]
            }
        },

        assemble: {
            options: {
                flatten: true,
                assets: '.tmp',
                layoutdir: '<%= config.src %>/templates/layouts/',
                layout: 'base.hbs',
                data: 'data.json',
                partials: '<%= config.src %>/templates/partials/**/*.hbs'
            },

            files: {
                expand: true,
                cwd: '<%= config.src %>/pages/',
                src: ['**/*.hbs'],
                dest: '.tmp/',
                ext: '.html'
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
                protocol: 'http'
            },
            livereload: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: LIVERELOAD_PORT,
                    open: true
                    // middleware: function (connect) {
                    //     return [
                    //         lrSnippet,
                    //         mountFolder(connect, projectConfig.dist)
                    //     ];
                    // }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, projectConfig.dist)
                        ];
                    }
                }
            }
        },

        // open: {
        //     server: {
        //         path: 'http://localhost:<%= connect.options.port %>'
        //     }
        // },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/**',
                        '.tmp',
                        '<%= config.dist %>/**'
                    ]
                }]
            },
            temp: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/**',
                        '.tmp'
                    ]
                }]
            }
        },

        coffee: {
            dist: {
                options: {
                    join: true
                },
//                files: [{
//                    expand: true,
//                    cwd: '<%= config.src %>/coffee',
//                    src: '{,*/}*.coffee',
//                    dest: '<%= config.src %>/js',
//                    ext: '.js'
//                }]
                files: {
                    '<%= config.dist %>/js/main.js' : [
                        '<%= config.src %>/coffee/lib/{,*/}*.coffee',
                        '<%= config.src %>/coffee/{,*/}*.coffee',
                        '<%= config.src %>/coffee/main.coffee']
                }
            }
        },

        compass: {
            options: {
                sassDir: '<%= config.src %>/sass',
                specify: '<%= config.src %>/sass/main.sass',
                //cssDir: '.tmp/styles',
                cssDir: '<%= config.dist %>/css',
                generatedImagesDir: '<%= config.dist %>/img',
                imagesDir: '<%= config.dist %>/img',
                javascriptsDir: '<%= config.dist %>/js',
                fontsDir: '<%= config.dist %>/fonts',
                relativeAssets: true,
            },
            dev: {
                options: {
                    outputStyle: 'expanded',
                    environment: 'development'
                }
            },
            devServe: {
                options: {
                    outputStyle: 'expanded',
                    environment: 'development',
                    watch: true
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            },
        },

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '.tmp/{,*/}*.html'
        },
        usemin: {
            options: {
                dirs: ['<%= config.dist %>']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css'],
            js: ['<%= config.dist %>/js/{,*/}*.js']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/img',
                    src: '{,*/}*.{gif,png,jpg,jpeg}',
                    dest: '<%= config.dist %>/img'
                },{
                    expand: true,
                    cwd: '<%= config.src %>',
                    src: '*.{gif,png,jpg,jpeg}',
                    dest: '<%= config.dist %>'
                },{
                    expand: true,
                    cwd: '<%= config.src %>/vendor/img',
                    src: '{,*/}*.{gif,png,jpg,jpeg}',
                    dest: '<%= config.dist %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/img'
                },{
                    expand: true,
                    cwd: '<%= config.src %>/vendor/img',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/css/main.css': [
                        '<%= config.dist %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: false,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },
        uncss: {
            options: {
                ignore: [
                    /.active/,
                    /.toggled/,
                    /.non-visible/,
                    /.gallery.col\-[0-9]/,
                    /swipebox/
                    ]
            },
            dist: {
                files: {
                    '<%= config.dist %>/css/main.css': ['<%= config.dist %>/{,*/}*.html']
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/

        modernizr: {
            dist: {
                devFile: '<%= config.src %>/vendor/js/modernizr.js',
                outputFile: '<%= config.dist %>/js/modernizr.js',
                extra : {
                    "shiv" : false,
                    "printshiv" : false,
                    "load" : true,
                    "mq" : false,
                    "cssclasses" : true
                },
                files: {
                    src: [
                        '<%= config.dist %>/js/**/*.js',
                        '<%= config.dist %>/css/**/*.css',
                    ]
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt,xml}',
                        '.htaccess',
                        '.htpasswd',
                        'img/{,*/}*.webp',
                        'fonts/**/*'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/vendor',
                    dest: '<%= config.dist %>',
                    src: [
                        'img/{,*/}*.webp'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp',
                    dest: '<%= config.dist %>',
                    src: [
                        '**/*.html'
                    ]
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/vendor/img',
                    dest: '<%= config.dist %>/img',
                    src: [
                        '**/*'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/vendor/js',
                    dest: '<%= config.dist %>/js/vendor',
                    src: [
                        '**/*'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/vendor/css',
                    dest: '<%= config.dist %>/css/vendor',
                    src: [
                        '**/*'
                    ]
                }]

            },
            img : {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>/img',
                    dest: '<%= config.dist %>/img',
                    src: [
                        '**/*'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'coffee',
                'compass:dev',
                'assemble',
                'copy:vendor',
            ],
            dist: [
                'coffee',
                'compass:dist',
                'assemble',
                'copy:vendor',
            ],
            minify: [
                'imagemin',
                'svgmin',
                'cssmin'
            ],
            watch: [
                'watch',
                'compass:devServe'
            ],
        }

    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'copy:img',
            'concurrent:server',
            'copy:html',
            'connect:livereload',
            // 'open:server',
            'concurrent:watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'copy:img',
        'concurrent:dist',
        'useminPrepare',
        'concat',
        'htmlmin',
        'uncss',
        'concurrent:minify',
        'uglify',
        'usemin',
        'modernizr',
        'clean:temp'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};