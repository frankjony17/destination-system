var fs = require('fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var versionAfterBump;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del']
});

gulp.task('release:bump', function () {
    var type = process.argv[3] ? process.argv[3].substr(2) : 'patch';
    return gulp.src(['./bower.json'])
        .pipe($.bump({type: type}))
        .pipe(gulp.dest('./'))
        .on('end', function () {
            versionAfterBump = require('../bower.json').version;
        });
});

gulp.task('release:rebuild', function (cb) {
    runSequence('release:bump', 'build','release:copiar', cb); // bump will here be executed before build
});

gulp.task('release:copiar', function (cb) {
  $.del.sync(['./../../release/'],{force: true});
  gulp.src(['./bower.json'])
    .pipe($.copy('./../../'));
  return gulp.src(['./dist/**/*'])
    .pipe(gulp.dest('./../../release/'));
});

gulp.task('release:commit', ['release:rebuild'], function () {
    return gulp.src(['./bower.json', './../../bower.json', './../../release/**/*'])
        .pipe($.git.add({args: '-A'}))
        .pipe($.git.commit('Release ' + versionAfterBump));
});

gulp.task('release:tag', ['release:commit'], function () {
    $.git.tag(versionAfterBump, versionAfterBump);
});

gulp.task('release:push', function () {
    $.git.push('origin', 'sistema-unificado-master', {args: " --tags"}, function (err) {
        if (err) throw err;
    });
});

gulp.task('release', ['release:tag'], function () {
    runSequence('release:push');
});
