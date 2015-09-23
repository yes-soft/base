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
        'angular-ie8/ie8-shim.js',
        'angular-ie8/angular.js',
        'angular-ie8/angular-ie8-fix.js',
        'components/angular-animate/angular-animate.js',
        'components/angular-cookie/angular-cookie.js',
        'components/angular-resource/angular-resource.js',
        'components/angular-sanitize/angular-sanitize.js',
        'components/angular-touch/angular-touch.js',
        'components/angular-translate/angular-translate.js',
        'components/angular-ui-router/release/angular-ui-router.js',
        'components/ngstorage/ngStorage.js',
        'components/oclazyload/dist/oclazyload.require.js',
        'components/moment/min/moment-with-locales.js',
        'components/angular-moment/angular-moment.js',
        'components/tinymce-dist/tinymce.min.js',
        'components/angular-ui-tinymce/src/tinymce.js'
    ])
        .pipe(concat('yes.bundle.js'))
        .pipe(gulp.dest(dist))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(dist));
});

gulp.task('vendor', function () {
    return gulp.src([
        'components/angular-bootstrap/ui-bootstrap-tpls.js',
        'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'components/angular-file-upload/dist/angular-file-upload.min.js',
        'components/angular-file-upload/dist/angular-file-upload.min.js.map',
        'components/angular-schema-form/dist/bootstrap-decorator.js',
        'components/angular-schema-form/dist/bootstrap-decorator.min.js',
        'components/angular-schema-form/dist/schema-form.js',
        'components/angular-schema-form/dist/schema-form.min.js',
        'components/angular-schema-form-datepicker/bootstrap-datepicker.js',
        'components/angular-schema-form-datepicker/bootstrap-datepicker.min.js',
        //'components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
        'components/es5-shim/es5-sham.js',
        'components/es5-shim/es5-sham.map',
        'components/es5-shim/es5-sham.min.js',
        'components/es5-shim/es5-shim.js',
        'components/es5-shim/es5-shim.map',
        'components/es5-shim/es5-shim.min.js',
        'components/html5shiv/dist/html5shiv.js',
        'components/html5shiv/dist/html5shiv.min.js',
        'components/objectpath/lib/ObjectPath.js',
        'components/Respond/dest/respond.min.js',
        'components/Respond/dest/respond.src.js',
        'components/jquery/dist/jquery.js',
        'components/jquery/dist/jquery.min.js',
        'components/jquery/dist/jquery.min.map',
        'components/jquery/dist/jquery.js',
        'components/jquery/dist/jquery.min.js',
        'components/jquery/dist/jquery.min.map',
        'components/tv4/tv4.js',
        'components/requirejs/require.js'
    ])
        .pipe(gulp.dest(dist + "vendor"));
});

gulp.task('toaster', function () {
    return gulp.src([
        'components/angular-toastr/dist/**/*'
    ])
        .pipe(gulp.dest(dist + "vendor/toaster"));
});

gulp.task('ui-grid', function () {
    return gulp.src([
        'components/angular-ui-grid/**/*'
    ])
        .pipe(gulp.dest(dist + "vendor/angular-ui-grid"));
});

gulp.task('bootstrap', function () {
    return gulp.src([
        'components/bootstrap/dist/**/*'
    ])
        .pipe(gulp.dest(dist + "vendor/bootstrap"));
});

gulp.task('datetimepicker', function () {
    return gulp.src([
        'components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js'
    ])
        .pipe(rename('ui.boostrap.datetimepicker.js'))
        .pipe(gulp.dest(dist + "vendor/angular-bootstrap-datetimepicker"));
});

gulp.task('select2', function () {
    return gulp.src([
        'components/select2/**/*'
    ])
        .pipe(gulp.dest(dist + "vendor/select2"));
});

gulp.task('tinymce', function () {
    return gulp.src([
        'components/tinymce-dist/**/*'
    ])
        .pipe(gulp.dest(dist + "vendor/tinymce"));
});

gulp.task('ng-dialog', function () {
    return gulp.src([
        'components/ngDialog/js/**/*.js',
        'components/ngDialog/css/**/*.css'
    ])
        .pipe(gulp.dest(dist + "vendor/ng-dialog"));
});

gulp.task('default', ['scripts', 'vendor', 'select2', 'bootstrap', 'toaster', 'ui-grid', 'datetimepicker', 'ng-dialog'],
    function () {
        console.log('done');
    });