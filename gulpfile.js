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
    return gulp.src('./components/yes-bundle/vendor/**/*')
        .pipe(gulp.dest(distBase + "vendor"));
});

gulp.task('copy-plugins', function () {
    return gulp.src('./src/plugins/**/*')
        .pipe(gulp.dest(dist + "plugins"));
});

gulp.task('copy-templates', function () {
    return gulp.src('./src/base/templates/**/*.html')
        .pipe(gulp.dest(distBase + "templates"));
});

gulp.task('copy-data', function () {
    return gulp.src('./src/data/**/*')
        .pipe(gulp.dest(dist + "data"));
});

gulp.task('basejs', function () {
    return gulp.src([
        './src/scripts/**/*.js'
    ])
        .pipe(concat('base.js'))
        .pipe(gulp.dest(distBase + scripts))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase + scripts));
});

gulp.task('css', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest(distBase + 'css'));
});

gulp.task('default', [ 'basejs', 'css',
        'copy-templates', 'copy-vendor', 'copy-plugins', 'copy-data'],
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