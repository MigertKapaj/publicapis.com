'use strict';

var fs        = require('fs');
var jade      = require('jade');
var gulp      = require('gulp');
var gjade     = require('gulp-jade');
var gutil     = require('gulp-util');
var less      = require('gulp-less');
var es        = require('event-stream');
var rimraf    = require('gulp-rimraf');
var connect   = require('gulp-connect');
var sequence  = require('run-sequence');
var imagemin  = require('gulp-imagemin');
var rename    = require('gulp-rename');
var combine   = require('gulp-jsoncombine');
var wrap      = require('gulp-wrap');
var uglify    = require('gulp-uglify');

// list all the paths
var paths = {
  dist: '.site/',
  apis: {
    data: 'data/apis/**/*.json',
    template: 'templates/api.jade'
  },
  less: 'assets/less/**/*.less',
  images: 'assets/images/**/*',
  scripts: 'assets/scripts/**/*.js',
  templates: {
    watch: ['templates/**/*.jade'],
    views: ['templates/*.jade', '!templates/*{xml,txt,api}.jade'],
    client: 'templates/client/*.jade'
  }
};

// custom jade rendering for JSON data
var render =  function (template) {
  return es.map(function (file, cb) {
    var data = JSON.parse(file.contents);
    var html = jade.renderFile(template, data);

    // set the new content & extension
    file.contents = new Buffer(html);
    file.path = gutil.replaceExtension(file.path, '.html');
    cb(null, file);
  });
}

// clean up
gulp.task('clean', function(cb) {
  return gulp.src(paths.dist + '*', { read: false })
    .pipe(rimraf());
});

// compile less
gulp.task('less', function () {
  gulp.src(paths.less)
    .pipe(less())
    .pipe(gulp.dest(paths.dist + 'assets/css'))
    .pipe(connect.reload());
});

// minify images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 9}))
    .pipe(gulp.dest(paths.dist + 'assets/images'));
});

// minify JavaScript
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'assets/js'));
});

// merge & minify JSON data
gulp.task('combine', function() {
  gulp.src(paths.apis.data)
    .pipe(combine('apis.js', function(data) {
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(wrap('var APIS = <%= contents %>'))
    .pipe(rename('data.js'))
    .pipe(gulp.dest(paths.dist + 'apis'));
});

// render main pages
gulp.task('render-main', function() {
  fs.readdir('data/apis', function (err, files) {
    gulp.src(paths.templates.views, '!' + paths.apis.template)
        .pipe(gjade({
          data: {
            count: files.length
          }
        }))
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
  });
});

// compile client templates
gulp.task('client-templates', function() {
  gulp.src(paths.templates.client)
    .pipe(gjade({
      client: true,
    }))
    .pipe(rename('template.js'))
    .pipe(gulp.dest(paths.dist + 'assets/js'))
});

// combile api pages
gulp.task('apis', function() {
  gulp.src(paths.apis.data)
    .pipe(render(paths.apis.template))
    .pipe(gulp.dest(paths.dist + 'apis'));
});

// server
gulp.task('connect', function() {
  connect.server({
    root: paths.dist,
    livereload: true
  });
});

// watcher
gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.apis.template, ['apis']);
  gulp.watch(paths.templates.watch, ['apis', 'render-main']);
  gulp.watch(paths.templates.client, ['client-templates']);
});

// build task
gulp.task('build', function (fn) {
  sequence('clean', ['combine', 'render-main', 'apis', 'less', 'images', 'scripts', 'client-templates'], fn)
});

// default task
gulp.task('default', function (fn) {
  sequence('build', 'watch', 'connect', fn)
});

// deployment task
