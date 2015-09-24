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

gulp.task('clean', function (cb) {
    return del([
        dist
    ], cb);
});

gulp.task('scripts', function () {
    return gulp.src([
        'src/index.js',
        'src/directives/**/*.js'
    ])
        .pipe(concat('yes.ui.js'))
        .pipe(gulp.dest(dist))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(dist));
});

gulp.task('default', ['scripts'],
    function () {
        console.log('done');
    });