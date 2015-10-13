var gulp = require('gulp'),
    fs = require("fs"),
    del = require('del'),
    concat = require('gulp-concat'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var inject = require('gulp-inject');
var annotate = require('gulp-ng-annotate');
var es = require('event-stream');
var path = require('path');


gulp.task('scripts', function () {
    return gulp.src(
        [
            'bootstrap-datepicker.min.js',
            'bootstrap-datetimepicker.min.js',
            'daterangepicker.min.js'
        ]
    )
        .pipe(concat('date.package.js'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(""));

});

gulp.task('css', function () {
    return gulp.src([
        'bootstrap-datetimepicker.min.css',
        'datepicker.min.css',
        'daterangepicker.min.css'
    ])
        .pipe(concat('date.package.min.css'))
        .pipe(gulp.dest(""));
});