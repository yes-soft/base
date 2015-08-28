var gulp = require('gulp'),
    fs = require("fs"),
    del = require('del'),
    concat = require('gulp-concat'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var inject = require('gulp-inject');
var annotate = require('gulp-ng-annotate');
var es = require('event-stream');
var path = require('path');

var dist = "./dist/";
var distBase = dist + "base/";
var scripts = "scripts";

gulp.task('clean', function (cb) {
    return del([
        dist
    ], cb);
});

gulp.task('copy-vendor', function () {
    return gulp.src('./src/base/vendor/**/*')
        .pipe(gulp.dest(distBase + "vendor"));
});

gulp.task('copy-plugins', function () {
    return gulp.src('./src/plugins/**/*')
        .pipe(gulp.dest(dist + "plugins"));
});


gulp.task('default', [ 'copy-vendor', 'copy-plugins', 'copy-data'],
    function () {

        var target = gulp.src('./src/dist.html').pipe(rename('index.html'));

        var js = gulp.src([
            'base/scripts/app.js',
            'base/scripts/base.js'
        ], {read: false, cwd: dist});

        var css = gulp.src([
            'base/css/main.css'
        ], {read: false, cwd: dist});

        target
            .pipe(inject(css, {addRootSlash: false}))
            .pipe(inject(js, {addRootSlash: false}))
            .pipe(gulp.dest(dist));
    });