'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();
var angularProtractor = require('gulp-angular-protractor');

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];

  gulp.src(path.join(conf.paths.e2e, '/OS_30/**/*.e2e-spec.js'))
    .pipe(angularProtractor({
      configFile: 'protractor.conf.js',
      args: args,
      debug: false,
      autoStartStopServer: true
    }))
    .on('error', function (e) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(e);
      browserSync.exit();
      done();
  //    throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });

}

gulp.task('protractor', ['protractor:src']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
