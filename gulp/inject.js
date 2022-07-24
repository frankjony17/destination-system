'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload();
});

gulp.task('inject:assets', function (cb) {

  return gulp.src('bower_components/su-*/dist/assets/**/*')
    .pipe($.copy(path.join(conf.paths.tmp, '/serve'), {prefix: 3}));

});

gulp.task('inject', ['inject:assets', 'scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/scripts-destinacao/**/*.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/scripts-destinacao/**/*.modules.js'),
    path.join(conf.paths.src, '/scripts-destinacao/**/*.js'),
    path.join('!' + conf.paths.src, '/scripts-destinacao/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/scripts-destinacao/**/*.mock.js')
  ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

   return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
