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

gulp.task('templates', function () {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest(distBase));
});

gulp.task('scripts', function () {
    return gulp.src([
        './../components/angular/angular.js',
        './../components/angular-animate/angular-animate.js',
        './../components/angular-bootstrap/ui-bootstrap-tpls.js',
        './../components/angular-cookie/angular-cookie.js',
        './../components/angular-resource/angular-resource.js',
        './../components/angular-sanitize/angular-sanitize.js',
        './../components/angular-touch/angular-touch.js',
        './../components/angular-translate/angular-translate.js',
        './../components/angular-ui-router/release/angular-ui-router.js',
        './../components/angular-ui-utils/ui-utils.js',
        './../components/angular-ui-grid/ui-grid.js',
        './../components/ngstorage/ngStorage.js',
        './../components/oclazyload/dist/oclazyload.js',
        './../components/moment/min/moment-with-locales.js',
        './../components/angular-moment/angular-moment.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(distBase + 'app'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase + 'app'));
});


gulp.task('basejs', function () {
    return gulp.src([
        './src/scripts/**/*.js'
    ])
        .pipe(concat('base.js'))
        .pipe(gulp.dest(distBase))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase));
});


gulp.task('css', function () {
    return gulp.src('./src/**/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest(distBase + 'css'));
});

gulp.task('default', ['scripts', 'basejs', 'css', 'templates', 'copy-vendor', 'copy-plugins'],
    function () {

        var target = gulp.src('./src/dist.html').pipe(rename('index.html'));

        var js = gulp.src([
            'base/app/app.min.js',
            'base/base.js'
        ], {read: false, cwd: dist});

        var css = gulp.src([
            'base/css/main.css'
        ], {read: false, cwd: dist});

        target
            .pipe(inject(css, {addRootSlash: false}))
            .pipe(inject(js, {addRootSlash: false}))
            .pipe(gulp.dest(dist));
    });