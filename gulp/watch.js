'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpCopy = require('gulp-copy');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('copiar-temp-desen', function () {
  var sourceFiles = ['templates-desen/*'];
  var destination = 'src/scripts-destinacao/';

  gulp.src(sourceFiles)
    .pipe(gulpCopy(destination));
});

gulp.task('watch', ['copiar-temp-desen','inject'], function () {


  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch(path.join(conf.paths.src, '/scripts-destinacao/**/*.css'), function(event) {
    if(isOnlyChange(event)) {
      browserSync.reload(event.path);
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/scripts-destinacao/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/scripts-destinacao/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});

