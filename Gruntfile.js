module.exports = function (grunt) {
  'use strict';

  var _     = require('underscore');
  var swig  = require('swig');
  var path  = require('path');

  grunt.registerMultiTask('render', 'Render HTML.', function () {
    grunt.log.writeln('Writing HTML');

    this.data.locals.apis = grunt.file.readJSON(this.data.json);

    grunt.file.expand(this.data.pages).forEach(function (page) {
      var name = path.basename(page);

      this.data.locals.path = this.data.dest + '/' + name;

      var html = swig.renderFile(page, this.data.locals);
      grunt.file.write(this.data.locals.path, html);
    }.bind(this));

    this.data.locals.apis.forEach(function (api) {
      var locals = _.extend(this.data.locals, api);

      locals.path = this.data.dest + '/api/' + api.id.charAt(0).toLowerCase() + '/' + api.id + '.html';

      var html = swig.renderFile(this.data.template, locals);
      grunt.file.write(locals.path, html);
    }.bind(this));
  });

  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    path: {
      site: 'site',
      dest: '.site',
      json: 'apis/**/*.json',
      less: 'site/assets/less/*.less',
      images: 'site/assets/images',
      scripts: 'site/assets/scripts/*.js',
    },

    pattern: {
      images: '*.{gif,jpg,png,ico,webp}'
    },

    /* Optimization */

    imagemin: {
      dist: {
        options: {
          progressive: true,
          optimizationLevel: 4
        },

        files: [{
          expand: true,
          cwd: '<%= path.images %>',
          src: ['**/<%= pattern.images %>'],
          dest: '<%= path.dest %>/assets/images/',
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          minifyJS: true,
          minifyCSS: true,
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeEmptyAttributes: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true
        },

        files: [{
          expand: true,
          cwd: '<%= path.dest %>',
          src: '**/*.html',
          dest: '<%= path.dest %>'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= path.dest %>/assets/css/main.css': '<%= path.dest %>/assets/css/main.css'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= path.dest %>/assets/scripts/main.js': '<%= path.scripts %>'
        }
      }
    },

    minjson: {
      dist: {
        src: ['<%= path.json %>'],
        dest: '<%= path.dest %>/apis.json'
      }
    },

    /* Quality Control */

    jsonlint: {
      dist: {
        src: ['<%= path.json %>']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      gruntfile: ['Gruntfile.js'],
      dist: ['<%= path.scripts %>'],
    },

    jscs: {
      options: {
        preset: 'yandex',
        //config: '.jscs.json',
      },

      gruntfile: ['Gruntfile.js'],
      dist: ['<%= path.scripts %>']
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },

      dist: {
        src: ['<%= path.dest %>/assets/css/*.css']
      }
    },

    /* Build Tools */

    clean: {
      dist: ['<%= path.dest %>/*']
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.site %>/assets',
          src: ['CNAME', 'robots.txt'],
          dest: '<%= path.dest %>'
        }]
      }
    },

    less: {
      dist: {
        files: {
          '<%= path.dest %>/assets/css/main.css': '<%= path.less %>'
        }
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },

      dist: {
        files: {
          '<%= path.dest %>/assets/css/main.css': '<%= path.dest %>/assets/css/main.css'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },

      dist: {
        src: ['<%= path.dest %>/assets/css/*.css']
      }
    },

    render: {
      dist: {
        dest: '<%= path.dest %>',
        json: '<%= path.dest %>/apis.json',
        template: '<%= path.site %>/api.html',
        pages: ['<%= path.site %>/index.html'],
        locals: {
          description: 'API Directory',
          author: {
            name: 'Mashape'
          },

          site: {
            fbadmin: 'xxx',
            twitter: 'mashape',
            url: 'http://www.publicapis.com',
            domain: 'publicapis.com'
          }
        }
      }
    },

    'gh-pages': {
      options: {
        base: '<%= path.dest %>'
      },
      src: '**/*'
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: 'localhost'
      },

      livereload: {
        options: {
          open: true,
          base: '<%= path.dest %>'
        }
      }
    },

    watch: {
      images: {
        files: ['<%= path.images %>/**/<%= pattern.images %>'],
        tasks: ['imagemin']
      },

      less: {
        files: ['<%= path.less %>'],
        tasks: ['less', 'autoprefixer', 'csscomb', 'cssmin', 'csslint']
      },

      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile', 'jscs:gruntfile']
      },

      js: {
        files: ['Gruntfile.js', '<%= path.scripts %>'],
        tasks: ['jshint:dist', 'jscs:dist', 'uglify']
      },

      html: {
        files: ['**/*.html'],
        tasks: ['render']
      },

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },

        files: [
          '<%= path.dest %>/*.html',
          '<%= path.dest %>/api/1/*.html',
          '<%= path.dest %>/css/**/*.css',
          '<%= path.dest %>/scripts/**/*.js',
          '<%= path.dest %>/images/**/<%= pattern.images %>'
        ]
      }
    }
  });

  /* Define Tasks */

  grunt.registerTask('check', [
    'jsonlint',
    'csslint',
    'jshint',
    'jscs'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'less',
    'autoprefixer',
    'csscomb',
    'cssmin',
    'uglify',
    'imagemin',
    'minjson',
    'render'
  ]);

  grunt.registerTask('default', [
    'build',
    'check'
  ]);

  grunt.registerTask('serve', [
    'default',
    'connect',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'default',
    'htmlmin',
    'gh-pages'
  ]);
};
