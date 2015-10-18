var gulp = require('gulp'),
    fs = require("fs"),
    del = require('del'),
    concat = require('gulp-concat'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify')
    ,minify = require('gulp-minify');

var inject = require('gulp-inject');
var annotate = require('gulp-ng-annotate');
var es = require('event-stream');
var path = require('path');


gulp.task('scripts', function () {
    return gulp.src(
        [
            'bootstrap-datepicker.min.js',
            'bootstrap-datetimepicker.min.js',
            'daterangepicker.js'
        ]
    )
        .pipe(concat('date.package.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(""));

});

gulp.task('css', function () {
    return gulp.src([
        'bootstrap-datetimepicker.min.css',
        'datepicker.min.css',
        'daterangepicker.css'
    ])
        .pipe(concat('date.package.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(""));
});