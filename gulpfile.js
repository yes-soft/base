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

gulp.task('require-js', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/vendor/require.js']
    )
        .pipe(concat('require.js'))
        .pipe(gulp.dest(distBase + scripts));
});

gulp.task('jquery', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/vendor/jquery.min.js']
    )
        .pipe(concat('jquery.min.js'))
        .pipe(gulp.dest(distBase + scripts));
});

gulp.task('scripts', function () {
    return gulp.src(
        ['./components/yes-bundle/dist/yes.bundle.js',
            './components/yes-utils/dist/yes.utils.js',
            './components/yes-bundle/dist/vendor/bootstrap/js/bootstrap.js',
            './components/yes-bundle/dist/vendor/ui-bootstrap-tpls.js',
            './components/yes-bundle/dist/vendor/toaster/angular-toastr.tpls.js',
            './components/yes-bundle/dist/vendor/angular-ui-grid/ui-grid.js',
            './components/yes-bundle/dist/vendor/tv4.js',
            './components/yes-bundle/dist/vendor/ObjectPath.js',
            './components/yes-bundle/dist/vendor/schema-form.js',
            './components/yes-bundle/dist/vendor/angular-file-upload.js',
            './components/yes-bundle/dist/vendor/ui.boostrap.datetimepicker.js',
            './components/yes-ui/dist/yes.ui.js']
    )
        .pipe(concat('yes.app.js'))
        .pipe(gulp.dest(distBase + scripts))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(distBase + scripts));

});

gulp.task('css', function () {
    return gulp.src('./src/base/css/**/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest(distBase + 'css'));
});

gulp.task('copy-plugins', function () {
    return gulp.src('./src/plugins/**/*')
        .pipe(gulp.dest(dist + "plugins"));
});

gulp.task('copy-data', function () {
    return gulp.src('./src/data/**/*')
        .pipe(gulp.dest(dist + "data"));
});

gulp.task('default', ['scripts', 'css', 'copy-vendor', 'copy-plugins', 'copy-data', 'require-js', 'jquery'],
    function () {

        var target = gulp.src('./src/dist.html').pipe(rename('index.html'));

        var js = gulp.src([
            'base/scripts/yes.app.js'
        ], {read: false, cwd: dist});

        var css = gulp.src([
            'base/css/main.css'
        ], {read: false, cwd: dist});

        target
            .pipe(inject(css, {addRootSlash: false}))
            .pipe(inject(js, {addRootSlash: false}))
            .pipe(gulp.dest(dist));
    });